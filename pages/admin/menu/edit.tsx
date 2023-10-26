import Collapse from "react-bootstrap/Collapse";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { ErrorMessage, FieldArray, Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import * as Yup from "yup";

import { SortableList } from "@/components/DnD/SortableList";
import PriceField from "@/components/Form/PriceField";
import SubmitResetButtons from "@/components/Form/SubmitResetButtons";
import { Menu, Price } from "@prisma/client";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { ChevronDown, ChevronUp, X } from "react-feather";
import BeforeUnload from "../../../components/Form/BeforeUnload";
import FieldWithError from "../../../components/Form/FieldWithError";
import FormError from "../../../components/Form/FormError";
import prisma from "../../../lib/prismadb";
import withAdminNav from "../../../lib/withAdminNav";
import FilterToggle from "@/components/Menu/FilterToggle";

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
      disabled: Yup.boolean(),
    })
  ),
});

type MenuWithPrice = Menu & {
  price: Price;
  mvIdx: number;
};

type EditMenuProps = {
  menu: MenuWithPrice[];
};

// TODO: Track changes across form updates; to the best of my knowledge, formik doesn't make this easy
// TODO: It may be *easier* binding to the `onChange` handler (which isn't exposed through `connect` AFAICT).
// TODO: At the very least this *doesn't work* but it's close-ish to working
// const Thing = connect<{}, { items: MenuWithPrice[] }>((props) => {
//   console.log(props.formik);
//   const { touched, values, initialValues, status, setStatus } = props.formik;
//   console.log(touched.items, status);

//   touched.items?.forEach((item, idx) => {
//     // Formik stores touched values in an array of length `items` where all values are undefined until they're touched
//     // Thus, we iterate through the array looking for defined items (i.e. everything that's been touched)
//     if (item !== undefined) {
//       // Grab the initial and current values; together we use these to check if the value has been updated
//       const initial = initialValues.items[idx];
//       const current = values.items[idx];
//       console.log("item", item);
//       // Item is an object where the key is the field that has been touched and the value is a boolean of whether or not it has been touched
//       // In practice, this is always true (once it has been touched) and it's unclear why it exists 🙃
//       Object.entries(item).forEach(([itemKey, value]) => {
//         // Look at the values of the item. They, as far as I know, can be booleans, objects, or arrays
//         // We're not using any array values as far as I know so we only check objects and booleans
//         console.log("value", value);
//         switch (typeof value) {
//           // TODO: Only support objects (not arrays tho) nested one deep
//           case "object":
//             // TODO:
//             Object.keys(value).forEach((key) => {
//               if (initial[itemKey][key] !== current[itemKey][key]) {
//                 console.log(
//                   initial[itemKey][key],
//                   "!==",
//                   current[itemKey][key]
//                 );
//               }
//             });
//             break;
//           case "boolean":
//             console.log(initial[itemKey], current[itemKey]);
//             if (initial[itemKey] !== current[itemKey]) {
//             }
//             break;
//         }
//       });
//       // Check diff of initial vs current from touched item
//       console.log(item, initial, current);
//       // for (const field in item) {
//       //   console.log(field);
//       // }
//     }
//   });

//   // for (const item of touched.items) {
//   //   console.log("item", item);
//   // }
//   return null;
// });

const EditMenu: React.FC<EditMenuProps> = ({ menu }) => {
  const router = useRouter();
  const [toastData, setToastData] = useState({
    type: "",
    message: "",
    show: false,
  });

  const [filter, setFilter] = useState({
    appetizer: false,
    entree: false,
    drink: false,
    dessert: false,
  });

  const [removed, setRemoved] = useState<Array<{ id: string; idx: number }>>(
    []
  );
  // const [searchText, setSearchText] = useState("");

  const onSubmit = async (
    values: {
      items: MenuWithPrice[];
    },
    { resetForm }: FormikHelpers<{ items: MenuWithPrice[] }>
  ) => {
    // If items have been removed from the menu we need to handle those first
    if (removed.length > 0) {
      try {
        const res = await fetch("/api/menu/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(removed),
        }).then((res) => res.json());
        if (res.ok) {
          console.info("Successfully removed item(s)");
        } else {
          console.error(`There was an error removing items ${res.error}`);
          // Bail if we're fucked
          return;
        }
      } catch (error) {
        console.error(`There was an error removing items ${error}`);
        // Also bail cuz we're super fucked
        return;
      }
    }
    const valuesWithNewIdx = values.items.map((item, idx) => ({
      ...item,
      idx,
    }));

    try {
      const res = await fetch("/api/menu/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: valuesWithNewIdx }),
      }).then((res) => res.json());
      if (res.ok) {
        console.info("Successfully updated menu");
        // Reset form with values submitted.
        resetForm({ values: { items: res.data } });
        setToastData({
          type: "success",
          message: "Success! You're changes should be visible in a few seconds",
          show: true,
        });
      } else {
        console.error(`There was an error updating the menu: ${res.error}`);
        setToastData({
          type: "error",
          message: "There was an error updating that. Maybe try again 🙃",
          show: true,
        });
        // Bail if we're fucked
        return;
      }
    } catch (error) {
      console.error(`There was an error updating the menu: ${error}`);
      setToastData({
        type: "error",
        message: "There was an error creating that. Maybe try again 🙃",
        show: true,
      });
    }
    console.info({ items: valuesWithNewIdx });
    console.info("Successfully updated menu");
    // Refresh the dataz 🤞
    router.replace(router.asPath);
  };

  const onRemove =
    (formikRemove: <T>(index: number) => T | undefined) =>
    ({ id, idx }: { id: string; idx: number }) => {
      formikRemove(idx);
      setRemoved([...removed, { id, idx }]);
    };

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
        <FilterToggle
          filterKey="appetizer"
          filter={filter}
          setFilter={setFilter}
        >
          Appetizers
        </FilterToggle>
        <FilterToggle filterKey="entree" filter={filter} setFilter={setFilter}>
          Entrees
        </FilterToggle>
        <FilterToggle filterKey="drink" filter={filter} setFilter={setFilter}>
          {(checked) => (checked ? "Dranks" : "Drinks")}
        </FilterToggle>
        <hr />

        <Formik
          initialValues={{ items: menu }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          onReset={() => setRemoved([])}
        >
          {({ isSubmitting, values, isValid, touched, errors, dirty }) => (
            <Form className="needs-validation" noValidate>
              <BeforeUnload />
              <FieldArray name="items">
                {({ remove, move }) => (
                  <SortableList
                    items={values.items}
                    // TODO: Need to update indexes; probably the easiest solution would be to just iterate through all the items and set their idx using the loops idx.
                    onChange={(activeIndex, overIndex) => {
                      move(activeIndex, overIndex);
                    }}
                    renderItem={(item) => (
                      <SortableList.Item id={item.id}>
                        <>
                          <EditMenuItem
                            mvIdx={item.mvIdx}
                            hasError={errors.items?.[item.idx] !== undefined}
                            item={item}
                            dragHandle={<SortableList.DragHandle />}
                            remove={onRemove(remove)}
                            // TODO: Allow separating removed and edited
                            // removed={removed.includes(item.idx)}
                          />
                          {/* <div className="d-flex justify-center items-center">
                            <hr style={{ flex: 1 }} />
                            <button
                              className="btn btn-outline-secondary btn-sm opacity-0 opacity-100-hover"
                              style={
                                {
                                  "--bs-btn-padding-y": "0.25rem",
                                  "--bs-btn-padding-x": "0.75rem",
                                } as React.CSSProperties
                              }
                            >
                              +
                            </button>
                          </div> */}
                          <hr style={{ flex: 1 }} />
                        </>
                      </SortableList.Item>
                    )}
                  />
                )}
              </FieldArray>
              <SubmitResetButtons
                isValid={isValid}
                isSubmitting={isSubmitting}
                dirty={dirty}
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
    </div>
  );
};

const formatItemPrice = (item: MenuWithPrice) => {
  switch (item.course) {
    case "appetizer":
    case "entree":
      return item.price.dinner;
    case "drink":
      return item.price.drinks;
    case "dessert":
      return item.price.dessert;
  }
};

type EditMenuItemProps = {
  mvIdx: number;
  item: MenuWithPrice;
  hasError: boolean;
  dragHandle: React.ReactNode;
  remove: (obj: { idx: number; id: string }) => void;
  // TODO: Allow separating removed and edited
  // removed: boolean;
};

function EditMenuItem({
  mvIdx: idx,
  item,
  hasError,
  dragHandle,
  remove,
}: // TODO: Allow separating removed and edited
// removed,
EditMenuItemProps) {
  const [open, setOpen] = useState(false);
  // TODO: Use this to show an edited state. Formik doesn't really support this out of the box so you'll have to get creative
  // const { values } = useFormikContext();

  return (
    <div
      className={`p-2 ${
        hasError && !open ? "border-start border-2 border-danger" : ""
      }`}
    >
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
          {dragHandle}
        </span>

        <span
          style={{
            cursor: "pointer",
            // TODO: Allow separating removed and edited
            // TODO: wtf does that mean gd ^
            textDecoration: `${item.disabled ? "line-through" : ""}`,
          }}
        >
          {item.name} - ${formatItemPrice(item)}
        </span>
        {/* TODO: Maybe have a delete button here? */}
        {/* <div className="btn-close" onClick={() => remove(idx)}></div> */}
        <span className="ms-auto" style={{ cursor: "pointer" }}>
          {open ? <ChevronUp size="18" /> : <ChevronDown size="18" />}
          <span className="border-start mx-2" />
          {/* TODO: Allow separating removed and edited */}
          {/* {removed ? (
            // <span className="fs-6">undo</span>
            <RotateCcw size={18} />
          ) : (
            <X onClick={() => remove(idx)} size={18} />
            )} */}
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Remove {item.name}</Tooltip>}
          >
            <X onClick={() => remove({ idx, id: item.id })} size={18} />
          </OverlayTrigger>
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

          <FieldWithError
            name={`items.${idx}.course`}
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
                    <PriceField key={1} service="lunch" idx={idx} />,
                    <PriceField key={2} service="dinner" idx={idx} />,
                  ];
                case "dessert":
                  return <PriceField service="dessert" idx={idx} />;
                case "drink":
                  return <PriceField service="drinks" idx={idx} />;
              }
            })()}
            <ErrorMessage component={FormError} name={`items.${idx}.service`} />
          </div>

          <FieldWithError
            placeholder="disabled"
            name={`items.${idx}.disabled`}
            type="checkbox"
          />
        </div>
      </Collapse>
    </div>
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

  // Roughly translates to:
  // SELECT `main`.`Menu`.`id`, `main`.`Menu`.`idx`, `main`.`Menu`.`name`, `main`.`Menu`.`description`, `main`.`Menu`.`service`, `main`.`Menu`.`course`, `main`.`Menu`.`disabled`, `main`.`Menu`.`priceId` FROM `main`.`Menu` WHERE 1=1 ORDER BY `main`.`Menu`.`course` ASC, `main`.`Menu`.`idx` ASC
  const menu = await prisma.menu.findMany({
    orderBy: [
      {
        course: "asc",
      },
      { idx: "asc" },
    ],
    include: {
      price: true,
    },
  });

  return {
    props: {
      menu,
    },
  };
};
