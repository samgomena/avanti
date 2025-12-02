import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

export const initialValue = {
  info: null,
  menu: null,
};

type AllowedFields = keyof typeof initialValue;

export default function useSavedChanges(field: AllowedFields) {
  const [savedChanges, setSavedChanges] = useLocalStorage(
    "avanti:changeset",
    initialValue
  );

  const submitSavedChanges = (values: unknown) => {
    if (process.env.NODE_ENV !== "production") {
      console.log({ ...savedChanges, [field]: values });
    }
  };

  const commitSavedChanges = () => (values: unknown) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(values);
    }
    setSavedChanges({ ...savedChanges, [field]: values });
  };

  return [commitSavedChanges, submitSavedChanges];
}
