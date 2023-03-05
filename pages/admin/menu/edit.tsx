import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";

import {
  ErrorMessage,
  FastField as Field,
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
  FormikValues,
} from "formik";
import { Fragment, useState } from "react";
import * as Yup from "yup";

import { getSession } from "next-auth/react";
import type { GetServerSideProps } from "next/types";
import { ChevronDown, ChevronUp } from "react-feather";
import BeforeUnload from "../../../components/Form/BeforeUnload";
import FieldWithError from "../../../components/Form/FieldWithError";
import FormError from "../../../components/Form/FormError";
import Move from "../../../components/Icons/Move";
import useMenu from "../../../lib/hooks/useMenu";
import { Menu, Services } from "../../../lib/types/menu";
import { serviceToDisplay } from "../../../lib/utils/utils";
import withAdminNav from "../../../lib/withAdminNav";

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
  // const [searchText, setSearchText] = useState("");

  return (
    <div className="row justify-content-center">
      <div className="col">
        <h3>Edit menu items</h3>
        {/* TODO: Add search input */}
        {/* <input
          type="text"
          className="form-control form-control-sm mb-3"
          placeholder="Search..."
        /> 
        <hr />
        */}
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
                      <EditMenuItem
                        idx={idx1}
                        name={name}
                        service={service}
                        remove={remove}
                      />
                      <hr />
                    </Fragment>
                  ))
                }
              </FieldArray>
              <div className="row fixed-bottom" style={{ position: "sticky" }}>
                <div className="col">
                  <Button
                    className="w-100"
                    type="submit"
                    variant="primary"
                    disabled={
                      !isValid || isSubmitting || values.items.length === 0
                    }
                  >
                    Update
                  </Button>
                </div>
                <div className="col">
                  <Button
                    className="w-100"
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

type EditMenuItemProps = {
  idx: number;
  name: string;
  service: Services;
  remove: (_: number) => void;
};

function EditMenuItem({ idx, name, service, remove }: EditMenuItemProps) {
  const [open, setOpen] = useState(false);
  const { services } = useMenu();
  return (
    <>
      <div
        className="fs-5 w-100 d-flex"
        style={{
          cursor: "pointer",
        }}
        onClick={() => setOpen(!open)}
      >
        <span
          className="opacity-0 opacity-100-hover"
          style={{
            cursor: "grab",
          }}
        >
          <Move />
        </span>

        <span>{name}</span>
        <span className="pl-4">
          {open ? <ChevronUp size="18" /> : <ChevronDown size="18" />}
        </span>
      </div>
      <Collapse in={open} timeout={50}>
        <div className="col-12 collapse" id={`toggle-${idx}`}>
          <FieldWithError name={`items.${idx}.name`} placeholder="Name" />

          <FieldWithError
            name={`items.${idx}.description`}
            placeholder="Description"
            as="textarea"
            type="text"
            rows={3}
          />

          <div className="form-group mb-3" role="group">
            {services.map((_service, idx2) => (
              <div className="form-check" key={`service-${idx}-${idx2}`}>
                <Field
                  className="form-check-input"
                  checked={service.indexOf(_service) !== -1}
                  type="checkbox"
                  value={_service}
                  name={`items.${idx}.service`}
                />
                <label className="form-check-label">
                  {serviceToDisplay(_service)}
                </label>

                <div className="input-group input-group-sm w-50 mb-3">
                  <span className="input-group-text">$</span>
                  <Field
                    className="form-control form-control-sm"
                    // This throws a warning because some service prices are not defined. Likely, you have to define a custom field that accounts for undefined values to fix this.
                    name={`items.${idx}.price.${_service}`}
                    type="number"
                    placeholder="Price"
                  />
                  <ErrorMessage
                    component={FormError}
                    name={`items.${idx}.price.${_service}`}
                  />
                </div>
              </div>
            ))}
            <ErrorMessage component={FormError} name={`items.${idx}.service`} />
          </div>
          <Button onClick={() => remove(idx)}>
            Remove {name} from the menu
          </Button>
        </div>
      </Collapse>
    </>
  );
}

export default withAdminNav(EditMenu);

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
