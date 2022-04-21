import flags from "../../data/flags.json";
import { Flags } from "../types/flags";

const useFlags = () => flags as Flags;

export const useFlag = (flag: string) => {
  const flags = useFlags();
  return flags[flag];
};

export default useFlags;
