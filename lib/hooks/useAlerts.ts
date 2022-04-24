import alerts from "../../data/alerts.json";
import { Alerts } from "../types/alerts";

const useAlerts = () => alerts as Alerts;

export default useAlerts;
