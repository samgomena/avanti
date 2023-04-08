import { FormikValues } from "formik";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

type SubmitResetButtonsProps = {
  submitText?: string;
  resetText?: string;
} & FormikValues;

const SubmitResetButtons: React.FC<SubmitResetButtonsProps> = ({
  isValid,
  isSubmitting,
  dirty,
  submitText = "Update",
  resetText = "Reset",
}) => {
  return (
    <div
      className="row fixed-bottom pb-2 bg-white"
      style={{ position: "sticky" }}
    >
      <div className="col">
        <Button
          className="w-100"
          type="submit"
          variant="primary"
          disabled={!isValid || isSubmitting || !dirty}
        >
          {isSubmitting ? (
            <Spinner animation="border" variant="light" role="status" size="sm">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            submitText
          )}
        </Button>
      </div>
      <div className="col">
        <Button
          className="w-100"
          type="reset"
          variant="secondary"
          disabled={!dirty}
        >
          {resetText}
        </Button>
      </div>
    </div>
  );
};

export default SubmitResetButtons;
