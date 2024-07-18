import { ErrorMessage, Field } from "formik";
import FormError from "./FormError";
import { useId } from "react";
import type { Service } from "../../lib/types/menu";
import { serviceToDisplay } from "../../lib/utils/utils";

const PriceField = ({ service, idx }: { service: Service; idx: number }) => {
  const id = useId();
  return (
    <div className="form-check" key={`service-${id}`}>
      <label className="form-check-label">{serviceToDisplay(service)}</label>

      <div className="input-group input-group-sm mb-3">
        <span className="input-group-text">$</span>
        <Field
          className="form-control form-control-sm"
          name={`items.${idx}.price.${service}`}
          // This should be a number we store them as string in the DB schema
          // See the FAQ.md for why that's the case
          // type="number"
          min="0"
          placeholder="Price"
        />
        <ErrorMessage
          component={FormError}
          name={`items.${idx}.price.${service}`}
        />
      </div>
    </div>
  );
};

export default PriceField;
