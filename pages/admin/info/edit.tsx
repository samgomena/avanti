import SubmitResetButtons from "@/components/Form/SubmitResetButtons";
import { Contact, Days } from "@prisma/client";
import { Form, Formik, FormikValues } from "formik";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import * as Yup from "yup";
import BeforeUnload from "../../../components/Form/BeforeUnload";
import Field from "../../../components/Form/FieldWithError";
import HoursField from "../../../components/Form/HoursField";
import { days } from "../../../lib/hooks/useInfo";
import { capitalize } from "../../../lib/utils/utils";
import withAdminNav from "../../../lib/withAdminNav";

const validationSchema = Yup.object({
  about: Yup.string().required("This is required!"),
  contact: Yup.object({
    address: Yup.string().required("An address is required!"),
    phone: Yup.string()
      .matches(
        /^\(?(\d\d\d)\)?-?(\d\d\d)-?(\d\d\d\d)$/g,
        "That's not a valid phone number!\nTip: Don't add a country code!"
      )
      .required("A phone number is required!"),
    email: Yup.string()
      .email("That's not a valid email address!")
      .required("An email address is required!"),
  }),
  hours: Yup.array(
    Yup.object({
      days: Yup.string().oneOf(days),
      open: Yup.string(),
      close: Yup.string(),
    })
  ),
});

type EditInfoProps = {
  info: {
    about: string;
    contact: Contact;
    hours: {
      open: string;
      close: string;
      day: Days;
    }[];
  };
};

const EditInfo: React.FC<EditInfoProps> = ({ info }) => {
  const router = useRouter();
  const [toastData, setToastData] = useState({
    type: "",
    message: "",
    show: false,
  });

  const onSubmit = async (values: FormikValues) => {
    const res = await fetch("/api/info/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((res) => res.json());

    if (res.ok) {
      console.info("Successfully updated info");
      // Refresh the dataz
      router.replace(router.asPath);
      setToastData({
        type: "success",
        message:
          "Site information updated successfully! You're changes should be visible in a few seconds",
        show: true,
      });
      return;
    }

    console.error(`There was an error submitting info: ${res.error}`);
    setToastData({
      type: "error",
      message: "There was an error updating info. Maybe try again 🙃",
      show: true,
    });
  };

  return (
    <div className="row justify-content-center">
      <div className="col">
        <h3>Edit site information</h3>
        <Formik
          initialValues={info}
          enableReinitialize // Resets form state after successful update (i.e. disables submit/reset buttons)
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ isSubmitting, values, isValid, dirty, setFieldValue }) => (
            <Form className="needs-validation" noValidate>
              <BeforeUnload />
              <div className="col">
                <Field
                  name="about"
                  placeholder="About"
                  as="textarea"
                  rows={3}
                />

                <Field name="contact.address" placeholder="Address" />
                {/* <PhoneField name="contact.phone" placeholder="Phone number" /> */}
                <Field name="contact.email" placeholder="Email" />
                <Field name="contact.phone" placeholder="Phone number" />

                {/* TODO(6/4/22): This needs validation/error handling */}
                {values?.hours.map((entry, idx) => (
                  <div key={idx} className="form-group mb-3">
                    <label>
                      {capitalize(entry.day)}
                      {(entry.open !== "" || entry.close !== "") && (
                        <HoursField idx={idx} />
                      )}
                      <div className="form-check">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            // Was open and now closed
                            if (e.target.checked) {
                              setFieldValue(`hours[${idx}]`, {
                                ...entry,
                                open: "",
                                close: "",
                              });
                            } else {
                              // Was closed and now open
                              setFieldValue(`hours[${idx}]`, {
                                ...entry,
                                open: "12:00",
                                close: "12:00",
                              });
                            }
                          }}
                          checked={entry.open === "" && entry.close === ""}
                          className="form-check-input"
                          id={`closed-${entry.day}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`closed-${entry.day}`}
                        >
                          Closed on {capitalize(entry.day)}
                        </label>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <SubmitResetButtons
                isValid={isValid}
                isSubmitting={isSubmitting}
                dirty={dirty}
              />
            </Form>
          )}
        </Formik>

        <ToastContainer className="d-inline-block m-4" position="top-end">
          <Toast
            bg={toastData.type === "error" ? "danger" : "light"}
            onClose={() => setToastData((prev) => ({ ...prev, show: false }))}
            show={toastData.show}
            delay={8_000} // 8 seconds
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">{toastData.message}</strong>
            </Toast.Header>
          </Toast>
        </ToastContainer>
      </div>
    </div>
  );
};

export default withAdminNav(EditInfo);

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

  const info = await prisma?.info.findFirst({
    include: {
      contact: true,
      hours: true,
    },
  });

  return {
    props: {
      info,
    },
  };
};
