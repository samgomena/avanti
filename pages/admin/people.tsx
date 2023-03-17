import BeforeUnload from "@/components/Form/BeforeUnload";
import Field from "@/components/Form/FieldWithError";
import { User } from "@prisma/client";
import { Form, Formik, FormikValues } from "formik";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { useState } from "react";
import { Modal, ModalProps, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import * as Yup from "yup";
import prisma from "../../lib/prismadb";
import withAdminNav from "../../lib/withAdminNav";

type PeopleProps = {
  users: User[];
};

const People: React.FC<PeopleProps> = ({ users }) => {
  const [showModal, setModalShow] = useState(false);
  return (
    <div className="row justify-content-center">
      <div className="col">
        <div className="row">
          <div className="col-3">
            <h3>People</h3>
          </div>
          <div className="col-6">
            <input
              className="form-control"
              type="text"
              placeholder="Search..."
            />
          </div>
          <div className="col-3">
            <Button onClick={() => setModalShow(true)}>Add new</Button>
          </div>
        </div>

        <Table className="mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name === null ? "N/A" : user.name}</td>
                <td>{user.email}</td>
                <td>Admin</td>
                <td>
                  {" "}
                  <UpdateModal
                    userValues={{
                      id: user.id,
                      name: user.name,
                      email: user.email,
                    }}
                  />
                  <DeleteUser userId={user.id} name={user.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <AddModal show={showModal} onHide={() => setModalShow(false)} />
    </div>
  );
};

const initialNewUser = {
  email: "",
  name: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("A name is required!"),
  email: Yup.string()
    .email("That's not a valid email address!")
    .required("An email address is required!"),
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
      <Button
        size="sm"
        variant="outline-primary"
        className="mx-2"
        onClick={() => setShow(true)}
      >
        Update
      </Button>
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

  const onSubmit = async (values: FormikValues) => {
    const res = await fetch("/api/people", {
      method: action === "create" ? "POST" : "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((res) => res.json());

    if (res.ok) {
      console.log(
        `Successfully ${action === "create" ? "created" : "updated"} user ${
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
        validationSchema={validationSchema}
      >
        {({ isValid, isSubmitting }) => (
          <Form className="needs-validation" noValidate>
            <BeforeUnload />
            <Modal.Body>
              <Field name="name" placeholder="Name" />
              <Field name="email" placeholder="Email" />
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

  const deleteUser = async () => {
    const res = await fetch("/api/people", {
      method: "DELETE",
      body: JSON.stringify({ userId }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (res.ok) {
      console.info(`Successfully deleted ${res.data.name} (${res.data.email})`);
      // Refresh the dataz
      router.replace(router.asPath);
    }
  };

  const onDelete = () => {
    setShow(true);
  };
  return (
    <>
      <ConfirmDeleteModal
        show={show}
        onHide={() => setShow(false)}
        onConfirm={deleteUser}
        name={name}
      />
      <Button size="sm" variant="outline-primary" onClick={onDelete}>
        Delete
      </Button>
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

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return {
    props: {
      users,
    },
  };
};
