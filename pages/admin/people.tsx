import BeforeUnload from "@/components/Form/BeforeUnload";
import Field from "@/components/Form/FieldWithError";
import { api } from "@/lib/api";
import { db } from "@/server/db";
import type { User } from "@prisma/client";
import { Form, Formik, type FormikValues } from "formik";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { useState } from "react";
import { Badge, Modal, type ModalProps, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Check, Edit, UserX, X } from "react-feather";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import withAdminNav from "../../lib/withAdminNav";

type PeopleProps = {
  users: User[];
};

const colSpan = 5;

const People: React.FC<PeopleProps> = ({ users }) => {
  const [showModal, setModalShow] = useState(false);
  return (
    <div className="row justify-content-center">
      <div className="col">
        <div className="row">
          <div className="col-3 col-md-8 col-lg-9">
            <h3>People</h3>
          </div>
          {/* <div className="col-6">
            <input
              className="form-control"
              type="text"
              placeholder="Search..."
            />
          </div> */}
          <div className="col-12 col-md-4 col-lg-3">
            <Button className="w-100" onClick={() => setModalShow(true)}>
              Add new
            </Button>
          </div>
        </div>
        <div className="table-responsive">
          <Table className="mt-4">
            <thead>
              <tr>
                <th colSpan={colSpan}>Name</th>
                <th colSpan={colSpan}>Email</th>
                <th colSpan={colSpan} className="d-none d-md-table-cell">
                  Email Verified
                </th>
                <th colSpan={colSpan}>Edit</th>
                <th colSpan={colSpan}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td colSpan={colSpan}>
                    {user.name === null ? "N/A" : user.name}
                  </td>
                  <td colSpan={colSpan}>
                    {user.email}{" "}
                    <span className="d-md-inline d-md-none">
                      {!user.emailVerified ? (
                        <Check className="text-success" size={12} />
                      ) : (
                        <X className="text-danger" size={12} />
                      )}
                    </span>
                  </td>
                  <td colSpan={colSpan} className="d-none d-md-table-cell">
                    {user.emailVerified ? (
                      <Badge bg="success">Yes</Badge>
                    ) : (
                      <Badge bg="danger">No</Badge>
                    )}
                  </td>
                  <td colSpan={colSpan}>
                    <UpdateModal
                      userValues={{
                        id: user.id,
                        name: user.name,
                        email: user.email,
                      }}
                    />
                  </td>
                  <td colSpan={colSpan}>
                    <DeleteUser userId={user.id} name={user.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <AddModal show={showModal} onHide={() => setModalShow(false)} />
    </div>
  );
};

const initialNewUser = {
  email: "",
  name: "",
};

export const validationSchema = z.object({
  name: z.string({ required_error: "A name is required!" }),
  email: z
    .string({ required_error: "An email address is required!" })
    .email({ message: "That's not a valid email address!" }),
  id: z.string().optional(),
});

const AddModal = ({ show, onHide }: ModalProps) => (
  <UpsertModal
    onHide={onHide}
    show={show}
    action="create"
    initialValues={initialNewUser}
  />
);

const UpdateModal = ({ userValues }: ModalProps) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <OverlayTrigger overlay={<Tooltip>Edit {userValues.name}</Tooltip>}>
        <Edit
          role="button"
          className="me-2 mb-2 mx-2"
          size={18}
          onClick={() => setShow(true)}
        />
      </OverlayTrigger>
      <UpsertModal
        onHide={() => setShow(false)}
        show={show}
        action="update"
        initialValues={userValues}
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

  const createMutation = api.people.create.useMutation({
    onSuccess: ({ data }) => {
      console.log(
        `Successfully ${action === "create" ? "created" : "updated"} user ${
          data.name
        } (${data.email})`
      );
      // Close the modal
      // biome-ignore lint/style/noNonNullAssertion: we pass this explicitly, so it's always defined but borrow the type from react-bootstrap so have to ignore the warno
      onHide!();
      // Refresh the dataz
      router.replace(router.asPath);
    },
    onError: console.error,
  });

  const updateMutation = api.people.update.useMutation({
    onSuccess: ({ data }) => {
      console.log(
        `Successfully ${action === "create" ? "created" : "updated"} user ${
          data.name
        } (${data.email})`
      );
      // Close the modal
      // biome-ignore lint/style/noNonNullAssertion: we pass this explicitly, so it's always defined but borrow the type from react-bootstrap so have to ignore the warno
      onHide!();
      // Refresh the dataz
      router.replace(router.asPath);
    },
    // TODO: Do something useful if there's an error??
    onError: console.error,
  });

  const onSubmit = async (values: FormikValues) => {
    action === "create"
      ? // @ts-expect-error
        createMutation.mutate({ ...values })
      : // @ts-expect-error
        updateMutation.mutate({ ...values });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>
          {action === "create" ? "Create" : "Update"} User
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={toFormikValidationSchema(validationSchema)}
      >
        {({ isValid, isSubmitting }) => (
          <Form className="needs-validation" noValidate>
            <BeforeUnload />
            <Modal.Body>
              <Field name="name" placeholder="Name" />
              <Field name="email" placeholder="Email" />
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
  name: string;
} & ModalProps;

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  onConfirm,
  show,
  onHide,
  name,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete <em>{name}</em>? This action cannot be
        undone!
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" type="submit" onClick={() => onConfirm()}>
          Confirm
        </Button>
        <Button onClick={onHide} variant="secondary">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const DeleteUser = ({ userId, name }: { userId: string; name: string }) => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const deleteMutation = api.people.delete.useMutation({
    onSuccess: ({ data }) => {
      console.info(`Successfully deleted ${data?.name} (${data?.email})`);
      // Refresh the dataz
      router.replace(router.asPath);
    },
    onError: console.error,
  });

  return (
    <>
      <ConfirmDeleteModal
        show={show}
        onHide={() => setShow(false)}
        onConfirm={() => deleteMutation.mutate({ id: userId })}
        name={name}
      />
      <OverlayTrigger overlay={<Tooltip>Delete {name}</Tooltip>}>
        <UserX
          role="button"
          className="me-2 mb-2 mx-2"
          size={18}
          onClick={() => setShow(true)}
        />
      </OverlayTrigger>
    </>
  );
};

export default withAdminNav<PeopleProps>(People);

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

  const _users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
    },
  });

  const users = _users.map((user) => ({
    ...user,
    emailVerified: user.emailVerified?.getTime() ?? null,
  }));

  return {
    props: {
      users,
    },
  };
};
