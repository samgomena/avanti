import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import useAlerts from "../lib/hooks/useAlerts";

const Alerts: React.FC = () => {
  const [alert] = useAlerts();
  const [show, setShow] = useState(true);
  const now = new Date();

  if (new Date(alert.start) > now && new Date(alert.end) < now) {
    return null;
  }

  return show ? (
    <Alert
      variant="warning"
      className="text-center"
      // This doesn't look right with no border radius
      style={{ borderRadius: "0.25rem" }}
      onClose={() => setShow(false)}
      dismissible
    >
      {alert.title && <Alert.Heading>{alert.title}</Alert.Heading>}
      {alert.text}
    </Alert>
  ) : null;
};

export default Alerts;
