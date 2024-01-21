import { ErrorMessage, Field as BaseField, FieldAttributes } from "formik";
import FormError from "./FormError";

function Field<T = any>({
  name,
  placeholder,
  showLabels = true,
  options = undefined,
  ...rest
}: FieldAttributes<T> & { showLabels?: boolean; placeholder?: string } & {
  options?: { name: string; value: string }[];
}) {
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
          {options?.map((option) => (
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
