import {
  ErrorMessage,
  FieldAttributes,
  useField,
  useFormikContext,
} from "formik";
import { ChangeEvent, MutableRefObject, useCallback, useRef } from "react";
import FormError from "./FormError";

const phoneRegex = /(\(?\d{0,3}\)?)-?(\d{0,3})-?(\d{0,4})/;

/**
 * Takes a list of regex match groups and returns a formatted phone number in the format (xxx)-xxx-xxxx
 * @param matches A list of regex matches for a phone number
 */
const formatPhone = (matches: Array<string> | null) => {
  if (matches === null) {
    return "";
  }
  const area = matches[1];
  let mids = matches[2];
  let ends = matches[3];

  if (!area) {
    return "";
  }

  if (!mids) {
    return `${area}`;
  }

  if (!ends) {
    return `${area}-${mids}`;
  }

  return `${area}-${mids}-${ends}`;
};

const PhoneField: React.FC<FieldAttributes<any>> = (props) => {
  const [_, { value }, { setValue }] = useField(props.name);
  const { handleBlur } = useFormikContext();
  const inputRef = useRef<string>(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    console.log("in effect wrapped call", rawValue);

    const phoneNumberMatches = rawValue.match(phoneRegex);

    const formattedPhone = formatPhone(phoneNumberMatches);
    inputRef.current = formattedPhone;

    const numbers = formattedPhone.replace(/(\D)/g, "");
    setValue(numbers);
  };

  const maskedRef = useCallback(
    (node: HTMLInputElement) => {
      if (node !== null) {
        console.log(node.value);
        node.value = formatPhone(node.value.match(phoneRegex));
      }
    },
    [value]
  );

  return (
    <div className="form-group mb-3">
      <label htmlFor={props.name}>{props.placeholder}</label>
      <input
        className="form-control"
        type="text"
        name={props.name}
        onChange={handleChange}
        onBlur={handleBlur}
        value={inputRef.current}
        ref={maskedRef}
      />
      <ErrorMessage component={FormError} name={props.name} />
    </div>
  );
};

export default PhoneField;
