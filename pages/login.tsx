import { Form, Formik, type FormikHelpers } from "formik";
import type { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { z } from "zod";
import Field from "../components/Form/FieldWithError";
import Header from "../components/Header";
import Section from "../components/Section";
import { toFormikValidationSchema } from "zod-formik-adapter";

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

type LoginValues = {
  email: string;
};

const initialValues: LoginValues = {
  email: "",
};

const validationSchema = z.object({
  email: z
    .string({ required_error: "Your email is required to log in!" })
    .email({ message: "That's not a valid email address!" }),
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
      // Track email sent event with Umami
      if (typeof window !== "undefined" && window.umami) {
        window.umami.track("Login-Email-Sent", {
          [values.email]: "true",
          email_sent_at: new Date().toISOString(),
        });
      }
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
          text: "An error occured while trying to sign in. Please try again.",
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
              validationSchema={toFormikValidationSchema(validationSchema)}
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
                          className="w-100"
                          type="submit"
                          variant="outline-primary"
                          disabled={!isValid || isSubmitting}
                        >
                          {isSubmitting ? (
                            <Spinner
                              animation="border"
                              variant="light"
                              role="status"
                              size="sm"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </Spinner>
                          ) : (
                            "login"
                          )}
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
