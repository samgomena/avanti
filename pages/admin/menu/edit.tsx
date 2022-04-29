import Button from "react-bootstrap/Button";

import {
  ErrorMessage,
  Formik,
  Form,
  FastField as Field,
  FieldArray,
  FormikValues,
  FormikHelpers,
} from "formik";
import { Fragment } from "react";
import * as Yup from "yup";

import FieldWithError from "../../../components/Form/FieldWithError";
import withAdminNav from "../../../lib/withAdminNav";
import useMenu from "../../../lib/hooks/useMenu";
import { Menu } from "../../../lib/types/menu";
import BeforeUnload from "../../../components/Form/BeforeUnload";
import { serviceToDisplay } from "../../../lib/utils/utils";
import FormError from "../../../components/Form/FormError";

const validationSchema = Yup.object({
  items: Yup.array().of(
    Yup.object({
      name: Yup.string().required("A name for this item is required!"),
      description: Yup.string(),
      // An array of the selected (checked) services
      // TODO?: An improvement could be to enforce an item to be in (dinner | lunch | hh) | drinks
      service: Yup.array()
        .of(Yup.string())
        .min(1, "At least one service period must be selected!"),
      price: Yup.object().when(
        "service",
        (service, schema) =>
          // Dynamically create and return the shape of the price schema
          schema.shape(
            // Here, service is an array of the selected (checked) service periods
            // But we want an object that looks like this { "<service1>": Yup.stuff(), "<service2>": Yup.stuf(), ... }
            service.reduce(
              (acc: Object, wutWut: string) => ({
                ...acc,
                // So, dynamically define requirements for the price of each selected service
                [wutWut]: Yup.number()
                  .moreThan(0, "The price has to be greater than $0!")
                  .required("A price is required for this service period!"),
              }),
              {}
            )
          )
        // ^^^ Is it performant? Nah, not really. Modifying values is *slow* and even slower with a regular
        // Field instead of FastField but better than accepting potentially invalid data imo
      ),
    })
  ),
});

const onSubmit = async (
  values: FormikValues,
  { setSubmitting }: FormikHelpers<Menu>
) => {
  await new Promise((r) => setTimeout(r, 1200));
  console.info(values);
};

const EditMenu: React.FC = () => {
  const menu = useMenu();
  return (
    <div className="row justify-content-center">
      <div className="col">
        <h3>Edit menu items</h3>
        <input
          type="text"
          className="form-control form-control-sm mb-3"
          placeholder="Search..."
        />
        <hr />
        <Formik
          initialValues={menu}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, values, isValid, resetForm, dirty }) => (
            <Form className="needs-validation" noValidate>
              <BeforeUnload />
              <FieldArray name="items">
                {({ remove }) =>
                  values.items.map(({ name, service }, idx1) => (
                    <Fragment key={`name-${idx1}`}>
                      <div className="col-12">
                        <FieldWithError
                          name={`items.${idx1}.name`}
                          placeholder="Name"
                        />

                        <FieldWithError
                          name={`items.${idx1}.description`}
                          placeholder="Description"
                          as="textarea"
                          type="text"
                          rows={3}
                        />

                        <div className="form-group mb-3" role="group">
                          {menu.services.map((_service, idx2) => (
                            <div
                              className="form-check"
                              key={`service-${idx1}-${idx2}`}
                            >
                              <Field
                                className="form-check-input"
                                checked={service.indexOf(_service) !== -1}
                                type="checkbox"
                                value={_service}
                                name={`items.${idx1}.service`}
                              />
                              <label className="form-check-label">
                                {serviceToDisplay(_service)}
                              </label>

                              <div className="input-group input-group-sm w-25 mb-3">
                                <span className="input-group-text">$</span>
                                <Field
                                  className="form-control form-control-sm"
                                  // This throws a warning because some service prices are not defined. Likely, you have to define a custom field that accounts for undefined values to fix this.
                                  name={`items.${idx1}.price.${_service}`}
                                  type="number"
                                  placeholder="Price"
                                />
                                <ErrorMessage
                                  component={FormError}
                                  name={`items.${idx1}.price.${_service}`}
                                />
                              </div>
                            </div>
                          ))}
                          <ErrorMessage
                            component={FormError}
                            name={`items.${idx1}.service`}
                          />
                        </div>
                      </div>
                      <Button onClick={() => remove(idx1)}>
                        Remove {name} from the menu
                      </Button>
                      <hr />
                    </Fragment>
                  ))
                }
              </FieldArray>
              <div className="row fixed-bottom" style={{ position: "sticky" }}>
                {/* <hr /> */}
                <div className="col-8">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={
                      !isValid || isSubmitting || values.items.length === 0
                    }
                  >
                    {`Submit ${values.items.length} ${
                      values.items.length === 1 ? "item" : "items"
                    }`}
                  </Button>
                </div>
                <div className="col-3">
                  <Button
                    type="reset"
                    variant="secondary"
                    disabled={!dirty}
                    onClick={() => resetForm()}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default withAdminNav(EditMenu);
