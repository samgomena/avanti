import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import useAlerts from "../lib/hooks/useAlerts";

const Alerts: React.FC = () => {
  const alerts = useAlerts();
  const alert = alerts.at(-1);
  const [show, setShow] = useState(true);
  const now = new Date();

  if (!alert?.start || !alert?.end) {
    throw Error(
      `Alert start and/or end is invalid (start=${alert?.start}, end=${alert?.end})`
    );
  }

  // If alert hasn't started yet or alert has expired then don't show it
  // Note: This is *exclusive* so the alert will show on the days of the start end dates
  if (now < new Date(alert?.start) || now > new Date(alert?.end)) {
    return null;
  }

  return show ? (
    <Alert
      variant="warning"
      className="text-center rounded"
      onClose={() => setShow(false)}
      dismissible
    >
      {alert.title && <Alert.Heading>{alert.title}</Alert.Heading>}
      {alert.text}
    </Alert>
  ) : null;
};

export default Alerts;
