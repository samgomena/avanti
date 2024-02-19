import flags from "../../data/flags.json";
import { Flags } from "../types/flags";
import { isProd } from "../utils/utils";

const useFlags = () => flags as Flags;

export const useFlag = (flag: keyof typeof flags) => {
  // ts should guarantee that we always use a valid flag; if not, this will throw later tho
  const selectedFlag = flags[flag];

  // Simple true/false enabled state
  if (typeof selectedFlag.enabled === "boolean") {
    return selectedFlag;
  }

  if (isProd()) {
    return {
      ...selectedFlag,
      enabled: selectedFlag.enabled.production === true,
    };
  }

  return {
    ...selectedFlag,
    enabled: selectedFlag.enabled.local === true,
  };
};

export default useFlags;
