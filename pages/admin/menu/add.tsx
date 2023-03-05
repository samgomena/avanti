import Button from "react-bootstrap/Button";

import { ErrorMessage, Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";

import FieldWithError from "../../../components/Form/FieldWithError";
import withAdminNav from "../../../lib/withAdminNav";
import { Item } from "../../../lib/types/menu";
import BeforeUnload from "../../../components/Form/BeforeUnload";
import React from "react";
import useMenu from "../../../lib/hooks/useMenu";
import { serviceToDisplay } from "../../../lib/utils/utils";
import FormError from "../../../components/Form/FormError";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";

const initialValue: Item = {
  name: "",
  description: "",
  service: [],
  price: {},
};

const validationSchema = Yup.object({
  items: Yup.array(
    Yup.object({
      name: Yup.string().required("A name for this item is required!"),
      description: Yup.string(),
      // An array of the selected (checked) services
      // TODO?: An improvement could be to enforce an item to be in (dinner | lunch | hh) | drinks
      service: Yup.array(Yup.string()).min(
        1,
        "At least one service period must be selected!"
      ),
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

const initialValues: { items: Item[] } = { items: [initialValue] };

const onSubmit = async (values: any) => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  try {
    const res = await fetch("/api/menu/add", {
      method: "POST",
      body: JSON.stringify(values),
    });
    console.log("Coolio McFly ; )", await res.json());
  } catch (error) {
    console.error("Whoopsies", error);
  }
};

const AddMenuItem: React.FC = () => {
  const menu = useMenu();
  return (
    <div>
      <h3>Add new menu items</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values, isValid }) => (
          <Form className="needs-validation" noValidate>
            <BeforeUnload />
            <FieldArray name="items">
              {({ remove, push }) => (
                <div className="row mb-3">
                  {values.items.map((item, idx1, { length }) => (
                    <div className="row gx-3 mb-3" key={idx1}>
                      <div className="col-10">
                        <FieldWithError
                          name={`items.${idx1}.name`}
                          placeholder="Name"
                          showLabels={false}
                        />

                        <FieldWithError
                          name={`items.${idx1}.description`}
                          placeholder="Description"
                          as="textarea"
                          rows={3}
                          showLabels={false}
                        />

                        <div className="form-group mb-3" role="group">
                          {menu.services.map((_service, idx2) => (
                            <div
                              className="form-check"
                              key={`service-${idx1}-${idx2}`}
                            >
                              <Field
                                className="form-check-input"
                                type="checkbox"
                                value={_service}
                                name={`items.${idx1}.service`}
                              />
                              <label className="form-check-label">
                                {serviceToDisplay(_service)}
                              </label>

                              <div className="input-group input-group-sm mb-3">
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
                      <div className="col">
                        <Button
                          onClick={() => remove(idx1)}
                          variant="outline-secondary"
                          // Not a fucking clue why `btn-lg` actually makes this smaller but it does
                          size="lg"
                        >
                          &times;
                        </Button>
                      </div>
                      {idx1 < length - 1 ? <hr /> : null}
                    </div>
                  ))}
                  <div className="row">
                    <div className="col-3">
                      <Button onClick={() => push(initialValue)}>
                        {values.items.length === 0
                          ? "Add a new item"
                          : "Add another"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </FieldArray>
            <div className="row">
              <hr />
              {values.items.length > 0 && (
                <div className="col-3">
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
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default withAdminNav(AddMenuItem);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: `/login?wantsUrl=${ctx.resolvedUrl}`,
      },
    };
  }

  return {
    props: {},
  };
};
