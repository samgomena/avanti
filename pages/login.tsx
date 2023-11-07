import Field from "../components/Form/FieldWithError";
import Header from "../components/Header";
import Section from "../components/Section";

import Button from "react-bootstrap/Button";

import { Form, Formik, FormikHelpers } from "formik";
import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/router";

type LoginValues = {
  email: string;
};

const initialValues: LoginValues = {
  email: "",
};

const LoginSchema = Yup.object({
  email: Yup.string()
    .email("That's not a valid email!")
    .required("Your email is required to log in!"),
});

const Login: React.FC = () => {
  const router = useRouter();
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  }>();

  const onSubmit = async (
    values: LoginValues,
    { setSubmitting }: FormikHelpers<LoginValues>
  ) => {
    setSubmitting(true);
    try {
      const res = await signIn("email", {
        email: values.email,
        // If a continuation url was passed use that otherwise default to the admin overview page
        // Use toString() because `wantsUrl` *could* be a `string[]` (ofc it never should be though)
        callbackUrl: router.query?.wantsUrl?.toString() ?? "/admin/overview",
        redirect: false,
      });
      if (!res?.error) {
        setMessage({
          type: "success",
          text: "Check your email for a login link!",
        });
      } else {
        setMessage({
          type: "error",
          text: "An error occured while trying to sign in. Check your email and try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occured while trying to sign in.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header title="Login" image="/assets/photos/wine_on_bar.jpg" />
      <Section>
        <div className="row justify-content-lg-center">
          <div className="col-lg-8">
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={LoginSchema}
            >
              {({ isSubmitting, isValid }) => (
                <Form className="needs-validation" noValidate>
                  <div className="row gx-3">
                    <div className="col">
                      <div className="mb-3 form-group">
                        <label className="visually-hidden" htmlFor="email">
                          Email
                        </label>
                        <Field
                          id="email"
                          className="form-control"
                          name="email"
                          placeholder="Email"
                          type="email"
                        />
                      </div>

                      {message && (
                        <p
                          className={`text-center fs-6 ${
                            message.type === "error"
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          {message.text}
                        </p>
                      )}

                      {(!message || message.type === "error") && (
                        <Button
                          type="submit"
                          variant="outline-primary"
                          className="w-100"
                          disabled={!isValid || isSubmitting}
                        >
                          {isSubmitting ? "logging in" : "login"}
                        </Button>
                      )}
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin/overview",
      },
    };
  }
  return {
    props: {},
  };
};
