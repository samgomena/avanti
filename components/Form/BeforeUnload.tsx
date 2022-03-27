import { useFormikContext } from "formik";
import useBeforeUnload from "../../lib/hooks/useBeforeUnload";

const BeforeUnload = () => {
  // TODO: This will throw an error if it's not used within the formik context.
  // It would be more better to wrap this in an error boundary
  const { dirty } = useFormikContext();
  useBeforeUnload(
    dirty,
    "You have unsaved changes, are you sure you want to leave?"
  );
  return null;
};

export default BeforeUnload;
