import BeforeUnload from "@/components/Form/BeforeUnload";
import Field from "@/components/Form/FieldWithError";
import { api } from "@/lib/api";
import { db } from "@/server/db";
import type { Alert as AlertType } from "@prisma/client";
import { Form, Formik, type FormikValues } from "formik";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { useState } from "react";
import { Alert, Button, Modal, type ModalProps } from "react-bootstrap";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
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
          <div className="col-3 col-md-8 col-lg-9">
            <h3>Alerts</h3>
          </div>
          <div className="col-12 col-md-4 col-lg-3">
            <Button
              size="sm"
              className="w-100"
              onClick={() => setModalShow(true)}
            >
              Create Alert
            </Button>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <h5>Upcoming</h5>
            {futureAlerts.length === 0 && (
              <div className="text-center">
                <em>You have no upcoming alerts</em>
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
                  <em>
                    ({formatDate(alert.start as unknown as string)} -{" "}
                    {formatDate(alert.end as unknown as string)})
                  </em>
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
            {pastAlerts.length === 0 && (
              <div className="text-center">
                <em>There are no past alerts</em>
              </div>
            )}
            {pastAlerts.map((alert) => (
              <Alert
                key={alert.id}
                variant="warning"
                className="text-center rounded"
              >
                {alert.title && <Alert.Heading>{alert.title}</Alert.Heading>}
                {alert.text}
                <div>
                  <em>
                    {/* 
                      TODO: Dates from the DB are UTC but presented here as TZ aware.
                      TODO: This causes the start/end dates to display the day before they technically are.
                    */}
                    ({formatDate(alert.start as unknown as string)} -{" "}
                    {formatDate(alert.end as unknown as string)})
                  </em>
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

export const validationSchema = z.object({
  start: z.string({ required_error: "A start date is required" }).date(),
  end: z.string({ required_error: "An end date is required" }).date(),
  title: z.string().optional(),
  text: z.string({ required_error: "This field is required" }),
  id: z.string().optional(),
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

  const createMutation = api.alerts.create.useMutation({
    onSuccess: () => {
      // Close the modal
      onHide?.();
      // Refresh the dataz
      router.replace(router.asPath);
    },
  });

  const updateMutation = api.alerts.update.useMutation({
    onSuccess: () => {
      // Close the modal
      onHide?.();
      // Refresh the dataz
      router.replace(router.asPath);
    },
    onError: console.error,
  });

  // TODO: Type dis better than `FormikValues`
  const onSubmit = async (values: FormikValues) => {
    action === "create"
      ? // @ts-expect-error
        createMutation.mutate({ ...values })
      : // @ts-expect-error
        updateMutation.mutate({ ...values });
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
        validationSchema={toFormikValidationSchema(validationSchema)}
      >
        {({ isValid, values }) => (
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
              <Button
                type="submit"
                disabled={
                  !isValid ||
                  createMutation.isPending ||
                  updateMutation.isPending
                }
              >
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

  const deleteMutation = api.alerts.delete.useMutation({
    onSuccess: () => {
      console.info("Successfully deleted alert");
      // Refresh the dataz
      router.replace(router.asPath);
    },
  });

  return (
    <>
      <ConfirmDeleteModal
        show={show}
        onHide={() => setShow(false)}
        onConfirm={() => deleteMutation.mutate({ id: alertId })}
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

  const _alerts = await db.alert.findMany({
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
