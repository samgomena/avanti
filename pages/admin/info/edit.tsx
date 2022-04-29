import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import {
  FieldArray,
  Field as FormikField,
  Form,
  Formik,
  FormikValues,
  ErrorMessage,
} from "formik";
import BeforeUnload from "../../../components/Form/BeforeUnload";
import Field from "../../../components/Form/FieldWithError";
import PhoneField from "../../../components/Form/PhoneField";
import useInfo, { days } from "../../../lib/hooks/useInfo";
import withAdminNav from "../../../lib/withAdminNav";
import HoursField from "../../../components/Form/HoursField";
import { capitalize } from "../../../lib/utils/utils";
import { Days } from "../../../lib/types/info";
import FormError from "../../../components/Form/FormError";
import { Fragment } from "react";
import * as Yup from "yup";
import useSavedChanges from "../../../lib/hooks/useSavedChanges";

// Declare new validator on array fields for hours
// Note: I *think* this adds the method to all instances of Yup across the site (the docs say something about how `addMethod` modifys the prototype)
declare module "yup" {
  interface ArraySchema<T> {
    uniqueDays(): this;
  }
}

// Add a custom validator to Yup that ensures that the array of days is unique
// I.e. A days open/closing hours can only be specified once so ensure no two days are selected at the same time
Yup.addMethod(Yup.array, "uniqueDays", function () {
  return this.test("uniqueDays", "", function (values) {
    const { path, createError } = this;

    // Map the list of "checked" days to the number of times each day has been checked
    // We preserve the mapping of day -> count so we provide a nice error message later on
    // Note: The max size of either array (values or _days) can only be 7 (for each day of the week) so this is O(7) (even though it looks a lot worse)
    const counts: { [d in Days]: number } = values?.reduce(
      (acc, { days: _days }) => {
        _days?.forEach((day: Days) => {
          // Default the count to 0 if it doesn't exist
          acc[day] ??= 0;
          // Increment the count for this day
          acc[day] += 1;
        });
        return acc;
      },
      {}
    );

    for (const [day, count] of Object.entries(counts)) {
      // If we find a day that has been checked more than once, return a validation error
      if (count > 1) {
        console.log(`${path}.${count - 1}.days`);
        return createError({
          path: `${path}.${count - 1}.days`,
          // path,
          message: `${capitalize(day)} has already been selected!`,
        });
      }
    }
    return true;
  });
});

const initialHoursValues = {
  days: [] as Days[],
  open: "",
  close: "",
};

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
      days: Yup.array(Yup.string().oneOf(days)).min(
        1,
        "At least one day must be selected!"
      ),
      open: Yup.string(),
      close: Yup.string(),
    })
  ).uniqueDays(),
});

const EditInfo: React.FC = () => {
  const info = useInfo();

  const onSubmit = async (values: FormikValues) => {
    // setSavedChanges(values);
    await new Promise((r) => setTimeout(r, 1500));
    console.info(values);
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
          {({ isSubmitting, errors, values, isValid, resetForm, dirty }) => (
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

                <FieldArray name="hours">
                  {({ push, remove }) => (
                    <div className="form-group mb-3" role="group">
                      {values.hours.map((_, idx1) => (
                        <Fragment key={`hours-${idx1}`}>
                          <div>
                            <CloseButton
                              className="float-end"
                              onClick={() => remove(idx1)}
                              aria-label="remove"
                            />
                          </div>
                          {days.map((day, idx2) => (
                            <div
                              key={`day-${idx2}`}
                              className="form-check form-check-inline"
                            >
                              <label className="form-check-label">
                                <FormikField
                                  className="form-check-input"
                                  type="checkbox"
                                  name={`hours.${idx1}.days`}
                                  value={day}
                                />
                                {capitalize(day)}
                              </label>
                            </div>
                          ))}
                          <ErrorMessage
                            component={FormError}
                            name={`hours.${idx1}.days`}
                          />
                          <HoursField idx={idx1} />
                        </Fragment>
                      ))}
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => push(initialHoursValues)}
                      >
                        +
                      </Button>
                    </div>
                  )}
                </FieldArray>
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
