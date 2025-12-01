import {
  ErrorMessage,
  FieldAttributes,
  useField,
  useFormikContext,
} from "formik";
import MaskedInput from "../MaskedInput";
import FormError from "./FormError";

const PhoneField: React.FC<FieldAttributes<any>> = (props) => {
  const [field, { value }, { setValue }] = useField(props.name);
  const { handleBlur } = useFormikContext();

  return (
    <div className="form-group mb-3">
      <label htmlFor={props.name}>{props.placeholder}</label>
      <MaskedInput
        mask="(999)-999-9999"
        className="form-control"
        {...field}
        value={value}
        onChange={(rawValue) => setValue(rawValue)}
        onBlur={handleBlur}
      />
      <ErrorMessage component={FormError} name={props.name} />
    </div>
  );
};

export default PhoneField;
