import { ErrorMessage, Field as BaseField, FieldAttributes } from "formik";
import FormError from "./FormError";

const Field: React.FC<FieldAttributes<any>> = ({
  name,
  placeholder,
  showLabels = true,
  ...rest
}) => {
  return (
    <div className="form-group mb-3">
      <label htmlFor={name} className={showLabels ? "" : "visually-hidden"}>
        {placeholder}
      </label>
      <BaseField
        className="form-control"
        name={name}
        placeholder={placeholder}
        {...rest}
      />
      <ErrorMessage component={FormError} name={name} />
    </div>
  );
};

export default Field;
