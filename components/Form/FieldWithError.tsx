import { ErrorMessage, Field as BaseField, FieldAttributes } from "formik";
import FormError from "./FormError";

function Field<T = any>({
  name,
  placeholder,
  showLabels = true,
  options = undefined,
  ...rest
}: FieldAttributes<T> & { showLabels?: boolean } & {
  options?: { name: string; value: string }[];
}) {
  return (
    <div className="form-group mb-3">
      <label htmlFor={name} className={showLabels ? "" : "visually-hidden"}>
        {placeholder}
      </label>
      {rest.as === "select" ? (
        <BaseField
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
          className="form-control"
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
