import info from "../../data/info.json";
import { Info } from "../types/info";

const useInfo = () => info as Info;

export const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const useHours = () => {
  const { hours } = useInfo();
  return hours;
};

export default useInfo;
