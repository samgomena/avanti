import Button from "react-bootstrap/Button";

import { ErrorMessage, FieldArray, Form, Formik, FormikValues } from "formik";
import * as Yup from "yup";

import PriceField from "@/components/Form/PriceField";
import SubmitResetButtons from "@/components/Form/SubmitResetButtons";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import React, { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import BeforeUnload from "../../../components/Form/BeforeUnload";
import FieldWithError from "../../../components/Form/FieldWithError";
import FormError from "../../../components/Form/FormError";
import { Item } from "../../../lib/types/menu";
import { inflect } from "../../../lib/utils/utils";
import withAdminNav from "../../../lib/withAdminNav";

const initialValue: Item = {
  name: "",
  description: "",
  course: "appetizer",
  service: [],
  price: {
    lunch: null,
    dinner: null,
    hh: null,
    dessert: null,
    drinks: null,
  },
};

const validationSchema = Yup.object({
  items: Yup.array(
    Yup.object({
      name: Yup.string().required("A name for this item is required!"),
      description: Yup.string(),
      course: Yup.string()
        .oneOf(["appetizer", "entree", "drink", "dessert"])
        .required(
          "Must be one of 'appetizer', 'entree', 'drink', or 'dessert'"
        ),
      price: Yup.object().when("course", (course, schema) => {
        switch (course) {
          case "appetizer":
          case "entree":
            return schema.shape({
              dinner: Yup.number()
                .positive("The price has to be greater than $0!")
                .nullable(),
              lunch: Yup.number()
                .positive("The price has to be greater than $0!")
                .nullable(),
            });
          case "drink":
            return schema.shape({
              drinks: Yup.number()
                .positive("The price has to be greater than $0!")
                .nullable(),
            });
          case "dessert":
            return schema.shape({
              dessert: Yup.number()
                .positive("The price has to be greater than $0!")
                .nullable(),
            });
        }
      }),
    })
  ),
});

const initialValues: { items: Item[] } = { items: [initialValue] };

const AddMenuItem: React.FC = () => {
  const [toastData, setToastData] = useState({
    type: "",
    message: "",
    show: false,
  });

  const onSubmit = async (
    values: FormikValues,
    // @ts-expect-error: This should be something like `FormikBag<something, something>` but the docs don't
    // say anything about it and I don't feel like digging through the sauce rn
    { resetForm }
  ) => {
    try {
      const res = await fetch("/api/menu/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => res.json());

      if (res.ok) {
        console.info("Successfully added menu item");
        // Refresh the dataz
        setToastData({
          type: "success",
          message: "Success! You're changes should be visible in a few seconds",
          show: true,
        });
        resetForm(initialValues);
        return;
      }

      console.error(`There was an error submitting info: ${res.error}`);
      setToastData({
        type: "error",
        message: "There was an error creating that. Maybe try again 🙃",
        show: true,
      });
    } catch (error) {
      console.error(`There was an error submitting info: ${error}`);
      setToastData({
        type: "error",
        message: "There was an error creating that. Maybe try again 🙃",
        show: true,
      });
    }
  };

  return (
    <div>
      <h3>Add new menu items</h3>
      <Formik
        initialValues={initialValues}
        enableReinitialize // Resets form state after successful update (i.e. disables submit/reset buttons)
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values, isValid, dirty }) => (
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

                        <FieldWithError
                          name={`items.${idx1}.course`}
                          placeholder="Course"
                          as="select"
                          options={[
                            { name: "Appetizers", value: "appetizer" },
                            { name: "Entrees", value: "entree" },
                            { name: "Drinks", value: "drink" },
                            { name: "Desserts", value: "dessert" },
                          ]}
                        />

                        <div className="form-group mb-3" role="group">
                          {(() => {
                            switch (item.course) {
                              case "appetizer":
                              case "entree":
                                return [
                                  <PriceField
                                    key={1}
                                    service="lunch"
                                    idx={idx1}
                                  />,
                                  <PriceField
                                    key={2}
                                    service="dinner"
                                    idx={idx1}
                                  />,
                                ];
                              case "dessert":
                                return (
                                  <PriceField service="dessert" idx={idx1} />
                                );
                              case "drink":
                                return (
                                  <PriceField service="drinks" idx={idx1} />
                                );
                            }
                          })()}
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
                          disabled={length === 1} // Allow deleting the first item if another one has been added
                        >
                          &times;
                        </Button>
                      </div>
                      {idx1 < length - 1 ? <hr /> : null}
                    </div>
                  ))}
                  <div className="row">
                    <Button
                      variant="secondary-outline"
                      onClick={() => {
                        push(initialValue);
                      }}
                    >
                      Add another
                    </Button>
                  </div>
                </div>
              )}
            </FieldArray>
            <SubmitResetButtons
              isValid={isValid}
              isSubmitting={isSubmitting}
              dirty={dirty}
              submitText={`Add ${inflect("item")(values.items.length)}`}
            />
          </Form>
        )}
      </Formik>

      <ToastContainer className="d-inline-block m-4" position="top-end">
        <Toast
          bg={toastData.type === "error" ? "danger" : "light"}
          onClose={() => setToastData((prev) => ({ ...prev, show: false }))}
          show={toastData.show}
          delay={8_000} // 8 seconds
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">{toastData.message}</strong>
          </Toast.Header>
        </Toast>
      </ToastContainer>
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
