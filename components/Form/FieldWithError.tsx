import { ErrorMessage, Field as BaseField, type FieldAttributes } from "formik";
import FormError from "./FormError";

interface Option {
  name: string;
  value: string;
}

interface FieldProps<T> extends FieldAttributes<T> {
  showLabels?: boolean;
  placeholder?: string;
  options?: Option[];
}

function Field<T = object>({
  name,
  placeholder,
  showLabels = true,
  options,
  ...rest
}: FieldProps<T> & FieldAttributes<T>) {
  return (
    <div
      className={`form-group mb-3 ${
        rest.type === "checkbox" ? "form-check" : ""
      }`}
    >
      <label
        htmlFor={name}
        className={`${rest.type === "checkbox" ? "form-check-label" : ""} ${
          showLabels ? "" : "visually-hidden"
        }
        `}
      >
        {placeholder}
      </label>
      {rest.as === "select" ? (
        <BaseField
          id={name}
          className="form-control"
          name={name}
          placeholder={placeholder}
          {...rest}
        >
          {options?.map((option: Option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </BaseField>
      ) : (
        <BaseField
          id={name}
          className={
            rest.type === "checkbox" ? "form-check-input" : "form-control"
          }
          name={name}
          placeholder={placeholder}
          {...rest}
        />
      )}
      <ErrorMessage component={FormError} name={name} />
    </div>
  );
}

export default Field;
