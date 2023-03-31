import BeforeUnload from "@/components/Form/BeforeUnload";
import Field from "@/components/Form/FieldWithError";
import { Alert as AlertType } from "@prisma/client";
import { Form, Formik, FormikValues } from "formik";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { useState } from "react";
import { Alert, Button, Modal, ModalProps } from "react-bootstrap";
import * as Yup from "yup";
import prisma from "../../lib/prismadb";
import { daysBetween, formatDate } from "../../lib/utils/utils";
import withAdminNav from "../../lib/withAdminNav";

type AlertsProps = {
  alerts: AlertType[];
};

const Alerts: React.FC<AlertsProps> = ({ alerts }) => {
  const [showModal, setModalShow] = useState(false);
  const now = new Date();
  const pastAlerts = alerts.filter((alert) => new Date(alert.end) < now);
  const futureAlerts = alerts.filter((alert) => new Date(alert.end) > now);

  return (
    <div className="row justify-content-center">
      <div className="col">
        <div className="row">
          <div className="col-3">
            <h3>Alerts</h3>
          </div>
          <div className="col-6"></div>
          <div className="col-3">
            <Button onClick={() => setModalShow(true)}>Create Alert</Button>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <h5>Upcoming</h5>
            {futureAlerts.length === 0 && (
              <div className="text-center">
                <em>There are no upcoming alerts</em>
              </div>
            )}
            {futureAlerts.map((alert) => (
              <Alert
                key={alert.id}
                variant="warning"
                className="text-center rounded"
              >
                {alert.title && <Alert.Heading>{alert.title}</Alert.Heading>}
                {alert.text}
                <div>
                  {formatDate(alert.start as unknown as string)} -{" "}
                  {formatDate(alert.end as unknown as string)}
                </div>
                <div>
                  <span>
                    <UpdateModal alertValues={alert} />
                  </span>
                  <span>
                    <DeleteAlert alertId={alert.id} />
                  </span>
                </div>
              </Alert>
            ))}
            <h5 className="mt-4">Past Alerts</h5>
            {pastAlerts.map((alert) => (
              <Alert
                key={alert.id}
                variant="warning"
                className="text-center rounded"
              >
                {alert.title && <Alert.Heading>{alert.title}</Alert.Heading>}
                {alert.text}
                <div>
                  {formatDate(alert.start as unknown as string)} -{" "}
                  {formatDate(alert.end as unknown as string)}
                </div>
              </Alert>
            ))}
          </div>
        </div>
      </div>
      <AddModal show={showModal} onHide={() => setModalShow(false)} />
    </div>
  );
};

export default withAdminNav(Alerts);

const validationSchema = Yup.object({
  start: Yup.date().required("A start date is required"),
  end: Yup.date().required("An end date is required"),
  title: Yup.string(),
  text: Yup.string().required("This field is required"),
});

const initialNewAlert = {
  start: "",
  end: "",
  title: "",
  text: "",
};

const AddModal = ({ show, onHide }: ModalProps) => (
  <UpsertModal
    onHide={onHide}
    show={show}
    action="create"
    initialValues={initialNewAlert}
  />
);

const UpdateModal = ({ alertValues }: { alertValues: AlertType }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <Alert.Link className="mx-2" onClick={() => setShow(true)}>
        Update
      </Alert.Link>
      <UpsertModal
        onHide={() => setShow(false)}
        show={show}
        action="update"
        initialValues={{
          ...alertValues,
          // Grab just the date from the datetime string (note: these *are* `string` and not `Date`)
          // Gross, but necessary to get these to properly populate in a datetime input field
          start: (alertValues.start as unknown as string).split("T")[0],
          end: (alertValues.end as unknown as string).split("T")[0],
        }}
      />
    </>
  );
};

type UpsertProps = {
  initialValues: FormikValues;
  action: "create" | "update";
} & ModalProps;

const UpsertModal: React.FC<UpsertProps> = ({
  show,
  onHide,
  initialValues,
  action,
}) => {
  const router = useRouter();

  const onSubmit = async (values: FormikValues) => {
    const res = await fetch("/api/alerts", {
      method: action === "create" ? "POST" : "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((res) => res.json());

    if (res.ok) {
      console.log(
        `Successfully ${action === "create" ? "created" : "updated"} alert ${
          res.data.name
        } (${res.data.email})`
      );
      // Close the modal
      // Also, we know this is always defined because it's passed explicitly
      onHide!();
      // Refresh the dataz
      router.replace(router.asPath);
      return;
    }

    // TODO: Do something useful if there's an error??
  };

  const today = new Date();

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>
          {action === "create" ? "Create" : "Update"} Alert
        </Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ isValid, isSubmitting, values }) => (
          <Form className="needs-validation" noValidate>
            <BeforeUnload />
            <Modal.Body>
              <Field name="title" placeholder="Title" />
              <Field name="text" placeholder="Body" as="textarea" rows={3} />
              <Field
                name="start"
                placeholder="Start Date"
                type="date"
                min={
                  new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate()
                  )
                    .toISOString()
                    .split("T")[0]
                }
              />
              <Field
                name="end"
                placeholder="End Date"
                type="date"
                min={
                  values.start !== "" &&
                  new Date(values.start).toISOString().split("T")[0]
                }
              />
              {values.start !== "" && values.end !== "" && (
                <div className="mb-4">
                  <em className="text-warning">
                    This alert will be shown for{" "}
                    {daysBetween(new Date(values.start), new Date(values.end))}{" "}
                    days
                  </em>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {action === "create" ? "Add" : "Update"}
              </Button>
              <Button onClick={onHide} variant="secondary">
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

type ConfirmDeleteModalProps = {
  onConfirm: () => void;
} & ModalProps;

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  onConfirm,
  show,
  onHide,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this alert? This action cannot be
        undone!
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" type="submit" onClick={onConfirm}>
          Confirm
        </Button>
        <Button onClick={onHide} variant="secondary">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const DeleteAlert = ({ alertId }: { alertId: string }) => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const deleteAlert = async () => {
    console.log("Deleting", alertId);
    const res = await fetch("/api/alerts", {
      method: "DELETE",
      body: JSON.stringify({ id: alertId }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    console.log(res);

    if (res.ok) {
      console.info(`Successfully deleted alert`);
      // Refresh the dataz
      router.replace(router.asPath);
    }
  };

  return (
    <>
      <ConfirmDeleteModal
        show={show}
        onHide={() => setShow(false)}
        onConfirm={() => deleteAlert()}
      />
      <Alert.Link onClick={() => setShow(true)}>Delete</Alert.Link>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: `/login?wantsUrl=${ctx.resolvedUrl}`,
      },
    };
  }

  const _alerts = await prisma.alert.findMany({
    orderBy: {
      start: "desc",
    },
  });

  const alerts = _alerts.map((alert) => ({
    ...alert,
    start: alert.start.toISOString(),
    end: alert.end.toISOString(),
  }));

  return {
    props: {
      alerts,
    },
  };
};
