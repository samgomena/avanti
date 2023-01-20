import Button from "react-bootstrap/Button";
import { Form, Formik, FormikValues } from "formik";
import BeforeUnload from "../../../components/Form/BeforeUnload";
import Field from "../../../components/Form/FieldWithError";
import useInfo, { days } from "../../../lib/hooks/useInfo";
import withAdminNav from "../../../lib/withAdminNav";
import HoursField from "../../../components/Form/HoursField";
import { capitalize } from "../../../lib/utils/utils";
import * as Yup from "yup";

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

const EditInfo: React.FC = () => {
  const info = useInfo();

  const onSubmit = async (values: FormikValues) => {
    if (process.env.NODE_ENV !== "development") {
      console.log(values);
      return;
    }

    try {
      const res = await fetch("/api/info/edit", {
        method: "POST",
        body: JSON.stringify(values),
      });
      console.log("Coolio McFly ; )", await res.json());
    } catch (error) {
      console.error("Whoopsies", error);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col">
        <h3>Edit site information</h3>
        <Formik
          initialValues={info}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({
            isSubmitting,
            errors,
            values,
            isValid,
            resetForm,
            dirty,
            setFieldValue,
          }) => (
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
                {values.hours.map((entry, idx) => (
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

              <div className="row">
                <div className="col-2 col-md-3 col-sm-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!isValid || isSubmitting}
                  >
                    Submit
                  </Button>
                </div>
                <div className="col-2 col-md-3 col-sm-4">
                  <Button
                    type="reset"
                    variant="secondary"
                    disabled={!dirty}
                    onClick={() => resetForm()}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default withAdminNav(EditInfo);
