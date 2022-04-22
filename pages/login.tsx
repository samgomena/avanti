import Header from "../components/Header";
import Section from "../components/Section";
import Field from "../components/Form/FieldWithError";

import Button from "react-bootstrap/Button";

import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

type LoginValues = {
  email: string;
  password: string;
};

const initialValues: LoginValues = {
  email: "",
  password: "",
};

const LoginSchema = Yup.object({
  email: Yup.string()
    .email("That's not a valid email!")
    .required("Your email is required to log in!"),
  password: Yup.string().required("Your password is required to log in!"),
});

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = useCallback(
    (values: LoginValues, { setSubmitting }: FormikHelpers<LoginValues>) => {
      setTimeout(() => {
        console.log(JSON.stringify(values));
        if (
          values.email === "email@example.com" &&
          values.password === "password"
        ) {
          setSubmitting(false);
          router.push("/admin");
        }
      }, 1000);
    },
    [router]
  );

  return (
    <>
      <Header title="Login" image="" />
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

                      <div className="mb-3 form-group">
                        <label className="visually-hidden" htmlFor="password">
                          Password
                        </label>
                        <Field
                          id="password"
                          className="form-control"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                        />
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            onChange={() => setShowPassword(!showPassword)}
                            type="checkbox"
                            value=""
                            id="showPassword"
                            checked={showPassword}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="showPassword"
                          >
                            Show password
                          </label>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="outline-primary"
                        disabled={!isValid || isSubmitting}
                      >
                        {isSubmitting ? "Logging in" : "Login"}
                      </Button>
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
