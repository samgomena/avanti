import FloatingLabel from "react-bootstrap/FloatingLabel";
import { ErrorMessage, Field } from "formik";
import FormError from "./FormError";

const HoursField: React.FC<{ idx: number }> = ({ idx }) => {
  const open = `hours.${idx}.open`;
  const close = `hours.${idx}.close`;
  return (
    <div className="mb-3">
      <div className="d-flex flex-row">
        <div className="form-group">
          <FloatingLabel label="Open">
            <Field
              type="time"
              className="form-control"
              name={open}
              placeholder="Open"
            />
          </FloatingLabel>
          <ErrorMessage component={FormError} name={open} />
        </div>
        <div className="form-group  mx-2">
          <FloatingLabel label="Close">
            <Field
              type="time"
              className="form-control"
              name={close}
              placeholder="Close"
            />
          </FloatingLabel>
          <ErrorMessage component={FormError} name={close} />
        </div>
      </div>
    </div>
  );
};

export default HoursField;
