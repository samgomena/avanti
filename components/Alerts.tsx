import { Alert as AlertType } from "@prisma/client";
import { useState } from "react";
import Alert from "react-bootstrap/Alert";

type AlertProps = {
  alerts: AlertType[];
};

const Alerts: React.FC<AlertProps> = ({ alerts }) => {
  alerts = alerts.map((alert) => ({
    ...alert,
    start: new Date(alert.start),
    end: new Date(alert.end),
  }));
  // TODO: This should instead be sorted by date start and/or end date instead of grabbing the last one
  // TODO: This is because it will likely be beneficial to queue up a number of events to show in the future.
  const alert = alerts.at(0);
  const [show, setShow] = useState(true);
  const now = new Date();

  if (!alert) {
    return null;
  }

  if (!alert?.start || !alert?.end) {
    throw Error(
      `Alert start and/or end is invalid (start=${alert?.start}, end=${alert?.end})`
    );
  }

  // If alert hasn't started yet or alert has expired then don't show it
  // Note: This is *not* exclusive. This is because we're comparing date*times* not just dates
  // Note: So, this will be true on the last day if it's stored as a date only (b/c the hours/minutes/seconds will be past 12:00 AM of the last day)
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
