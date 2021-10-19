import Header from "../components/Header";
import Section from "../components/Section";
import FormError from "../components/FormError";

import Button from "react-bootstrap/Button";

import { useCallback, useState } from "react";
import { Form, Formik, Field, FormikHelpers } from "formik";
import * as Yup from "yup";

type LoginValues = {
  email: string;
  password: string;
};

const LoginSchema = Yup.object({
  email: Yup.string().email("Email is invalid").required("Email is required."),
  password: Yup.string().required("Password is required."),
});

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const initialValues: LoginValues = {
    email: "",
    password: "",
  };

  const onSubmit = useCallback(
    (values: LoginValues, { setSubmitting }: FormikHelpers<LoginValues>) => {
      setTimeout(() => {
        console.log(JSON.stringify(values));
        setSubmitting(false);
      }, 1000);
    },
    []
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
              {({ errors, touched, isSubmitting, isValid }) => (
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
                        <FormError
                          errors={errors}
                          touched={touched}
                          field="email"
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
                        <FormError
                          errors={errors}
                          touched={touched}
                          field="password"
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
                        Login
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
