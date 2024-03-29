import Collapse from "react-bootstrap/Collapse";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Tooltip from "react-bootstrap/Tooltip";

import { ErrorMessage, FieldArray, Form, Formik, FormikHelpers } from "formik";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import * as Yup from "yup";

import { SortableList } from "@/components/DnD/SortableList";
import BeforeUnload from "@/components/Form/BeforeUnload";
import FieldWithError from "@/components/Form/FieldWithError";
import FormError from "@/components/Form/FormError";
import PriceField from "@/components/Form/PriceField";
import SubmitResetButtons from "@/components/Form/SubmitResetButtons";
import FilterToggle from "@/components/Menu/FilterToggle";
import HelpModal from "@/components/Menu/HelpModal";
import { formatItemPrice } from "@/lib/utils/utils";
import { Courses, Menu, Price } from "@prisma/client";
import classNames from "classnames";
import { DetailedDiff, detailedDiff } from "deep-object-diff";
import { getSession } from "next-auth/react";
import type { GetServerSideProps } from "next/types";
import { ChevronDown, ChevronUp, X } from "react-feather";
import prisma from "../../../lib/prismadb";
import withAdminNav from "../../../lib/withAdminNav";

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
      price: Yup.object()
        .when("course", {
          is: (course: Courses) => ["appetizer", "entree"].includes(course),
          then: (schema) =>
            schema.shape({
              dinner: Yup.number()
                .positive("The price has to be greater than $0!")
                .nullable(),
              lunch: Yup.number()
                .positive("The price has to be greater than $0!")
                .nullable(),
            }),
        })
        .when("course", {
          is: (course: Courses) => course === "drink",
          then: (schema) =>
            schema.shape({
              drinks: Yup.number()
                .positive("The price has to be greater than $0!")
                .nullable(),
            }),
        })
        .when("course", {
          is: (course: Courses) => course === "dessert",
          then: (schema) =>
            schema.shape({
              dessert: Yup.number()
                .positive("The price has to be greater than $0!")
                .nullable(),
            }),
        }),
      disabled: Yup.boolean(),
    })
  ),
});

export type MenuWithPrice = Menu & {
  price: Price;
  mvIdx: number;
};

type EditMenuProps = {
  menu: MenuWithPrice[];
};

const initialValue = {
  name: "",
  description: "",
  course: "appetizer" as Courses,
  price: {
    lunch: "",
    dinner: "",
    drinks: "",
    dessert: "",
  },
  disabled: false,
};

const DiffStatus = createContext<{
  diff: DetailedDiff | undefined;
  setDiff: Dispatch<SetStateAction<DetailedDiff | undefined>>;
}>({
  diff: {
    added: { items: [] },
    deleted: {},
    updated: { items: [] },
  },
  setDiff: (_diff) => {},
});

const Diff = ({ lhs, rhs }: { lhs: object; rhs: object }) => {
  const { setDiff } = useContext(DiffStatus);
  const _diff = useMemo(
    // TODO: Only diff against fields we care about?
    () => detailedDiff(lhs, rhs),
    [lhs, rhs]
  );
  useEffect(() => setDiff(_diff), [_diff]);

  return null;
};

const EditMenu: React.FC<EditMenuProps> = ({ menu }) => {
  const [toastData, setToastData] = useState({
    type: "",
    message: "",
    show: false,
  });

  const dryRun = false;

  const [filter, setFilter] = useState({
    appetizer: false,
    entree: false,
    drink: false,
    dessert: false,
  });

  const [toggle, setToggle] = useState({
    disabled: true,
  });

  const [searchText, setSearchText] = useState("");
  const [removed, setRemoved] = useState<Array<{ id: string; idx: number }>>(
    []
  );

  const [diff, setDiff] = useState<DetailedDiff | undefined>(undefined);

  const onSubmit = async (
    values: {
      items: MenuWithPrice[];
    },
    { resetForm }: FormikHelpers<{ items: MenuWithPrice[] }>
  ) => {
    // TODO: Maybe expose this as an option in the UI?
    // TODO: Could potentially show a menu preview?
    if (dryRun) {
      return;
    }
    const hasDeletedItems = Object.keys(diff?.deleted ?? {}).length > 0;
    let deleteReqsSuccessful = false;
    let updateReqsSuccessful = false;
    // If items have been removed from the menu we need to handle those first otherwise the idx of
    // any updated items will be off.
    if (hasDeletedItems) {
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
          deleteReqsSuccessful = true;
        } else {
          console.error(
            `There was an error (from the server) removing items ${JSON.stringify(
              res.error,
              null,
              2
            )}`
          );
        }
      } catch (error) {
        console.error(`There was a general error removing items ${error}`);
      }
    }
    // @ts-expect-error: We can't type the diff object any more concretely than `unknown` currently
    const valuesWithNewIdx = Object.entries(diff?.updated.items ?? {}).map(
      ([key, value]) => {
        // key is the index (from the db) of the item that we want to update
        // @ts-expect-error: We can't type the diff object any more concretely than `unknown` currently
        const obj = { ...value, idx: Number(key) };
        // Some updates don't add `id` to the diff but we need the id to be able to update the object
        // so if it doesn't exist we have to add it manually
        // @ts-expect-error: We can't type the diff object any more concretely than `unknown` currently
        if (!value.id) {
          obj.id = values.items[Number(key)].id;
        }
        return obj;
      }
    );
    let res;
    try {
      res = await fetch("/api/menu/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: valuesWithNewIdx }),
      }).then((res) => res.json());
      if (res.ok) {
        console.info("Successfully updated menu");
        updateReqsSuccessful = true;
      } else {
        console.error(
          `There was an error (from the server) while updating the menu: ${JSON.stringify(
            res.error,
            null,
            2
          )}`
        );
      }
    } catch (error) {
      console.error(`There was a general error updating the menu: ${error}`);
    }

    if (hasDeletedItems && deleteReqsSuccessful && updateReqsSuccessful) {
      // Reset form. This also resets the diff!
      resetForm({ values: { items: res.data } });
      setToastData({
        type: "success",
        message: "Success! You're changes should be visible in a few seconds",
        show: true,
      });
    } else if (updateReqsSuccessful) {
      resetForm({ values: { items: res.data } });
      setToastData({
        type: "success",
        message: "Success! You're changes should be visible in a few seconds",
        show: true,
      });
    } else {
      setToastData({
        type: "error",
        message: "There was an error while updating... Maybe try again? 🙃",
        show: true,
      });
    }
  };

  const onRemove =
    (formikRemove: <T>(index: number) => T | undefined) =>
    ({ id, idx }: { id: string; idx: number }) => {
      formikRemove(idx);
      setRemoved((prev) => [...prev, { id, idx }]);
    };

  return (
    <div className="row justify-content-center">
      <div className="col">
        <div className="col-md-8 col-lg-9">
          <h3 className="d-inline-flex" data-testid="title">
            Edit Menu Items
          </h3>
        </div>

        <DiffStatus.Provider value={{ diff, setDiff }}>
          <Formik
            initialValues={{ items: menu }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            onReset={() => setRemoved([])}
          >
            {({
              isSubmitting,
              values,
              initialValues,
              isValid,
              errors,
              dirty,
            }) => (
              <Form className="needs-validation" noValidate>
                <div
                  className="bg-white position-sticky py-2"
                  style={{ top: "72px" }}
                >
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search..."
                  />
                </div>
                <div className="mt-2">
                  <FilterToggle
                    filterKey="appetizer"
                    filter={filter}
                    setFilter={setFilter}
                    data-testid="filter-appetizers"
                  >
                    Appetizers
                  </FilterToggle>
                  <FilterToggle
                    filterKey="entree"
                    filter={filter}
                    setFilter={setFilter}
                    data-testid="filter-entrees"
                  >
                    Entrees
                  </FilterToggle>
                  <FilterToggle
                    filterKey="drink"
                    filter={filter}
                    setFilter={setFilter}
                    data-testid="filter-drinks"
                  >
                    {(checked) => (checked ? "Dranks" : "Drinks")}
                  </FilterToggle>
                  <FilterToggle
                    filterKey="dessert"
                    filter={filter}
                    setFilter={setFilter}
                    data-testid="filter-desserts"
                  >
                    Desserts
                  </FilterToggle>
                  <span className="border-start mx-2" />
                  <FilterToggle
                    filterKey="disabled"
                    filter={toggle}
                    setFilter={setToggle}
                    data-testid="toggle-disabled"
                  >
                    Hide Disabled
                  </FilterToggle>
                  <hr />
                </div>

                {/* Helper components */}
                <BeforeUnload />
                <Diff lhs={initialValues} rhs={values} />

                <FieldArray name="items">
                  {({ remove, move, insert }) => (
                    <SortableList
                      items={values.items}
                      // TODO: Need to update indexes; probably the easiest solution would be to just iterate through all the items and set their idx using the loops idx.
                      onChange={(activeIndex, overIndex) => {
                        move(activeIndex, overIndex);
                      }}
                      renderItem={(item) => (
                        <SortableList.Item id={item.id}>
                          <div
                            className={classNames(
                              "group",
                              // Filtering logic
                              {
                                // Don't filter items if there are *no* fitlers applied -- otherwise filter that bish
                                "d-none":
                                  Object.values(filter).some(Boolean) &&
                                  !filter[item.course],
                              },
                              // Toggle logic
                              { "d-none": item.disabled && toggle.disabled },
                              // Search logic
                              {
                                "d-none":
                                  item.name
                                    .toLowerCase()
                                    .indexOf(searchText) === -1,
                              }
                            )}
                            data-testid={`edit-item-container-${item.idx}`}
                          >
                            <EditMenuItem
                              mvIdx={item.mvIdx}
                              hasError={errors.items?.[item.idx] !== undefined}
                              item={item}
                              dragHandle={<SortableList.DragHandle />}
                              remove={onRemove(remove)}
                              // TODO: Allow separating removed and edited
                              // removed={removed.includes(item.idx)}
                            />
                            {/* TODO: Allow adding items in the middle of the thing */}
                            {/* <div>
                              <div className="d-flex group-hover opacity-0 opacity-100-hover">
                                <hr style={{ flex: 1, width: "40%" }} />
                                <div className="d-flex justify-center items-center">
                                  <button
                                    onClick={() =>
                                      insert(item.mvIdx, initialValue)
                                    }
                                    className="btn btn-outline-secondary btn-sm"
                                    style={
                                      {
                                        "--bs-btn-padding-y": "0.25rem",
                                        "--bs-btn-padding-x": "0.75rem",
                                      } as React.CSSProperties
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                                <hr
                                  style={{
                                    flex: 1,
                                    width: "40%",
                                    alignItems: "end",
                                  }}
                                />
                              </div>
                              {/* <hr style={{ flex: 1 }} />
                            </div> */}
                            <hr style={{ flex: 1 }} />
                          </div>
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
        </DiffStatus.Provider>

        <ToastContainer className="d-inline-block m-4" position="top-end">
          <Toast
            style={{ border: "none" }}
            bg={toastData.type === "error" ? "danger-subtle" : "success-subtle"}
            onClose={() => setToastData((prev) => ({ ...prev, show: false }))}
            show={toastData.show}
            delay={8_000} // 8 seconds
            autohide
          >
            <Toast.Body>
              <strong className="me-auto">{toastData.message}</strong>
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
      <HelpModal />
    </div>
  );
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
  // const { status } = useFormikContext();
  const { diff: status } = useContext(DiffStatus);
  return (
    <div
      className={classNames({
        "px-2 p-0": item.disabled,
        "p-2": !item.disabled,
        "border-start border-2 border-danger": hasError && !open,
      })}
      // Make disabled items shorter
      style={{
        marginTop: item.disabled ? "-0.5rem" : undefined,
        marginBottom: item.disabled ? "-0.5rem" : undefined,
      }}
    >
      <div
        className="fs-5 w-100 d-flex"
        role="button"
        onClick={() => setOpen(!open)}
      >
        <span
          className="opacity-0 opacity-100-hover group-hover"
          style={{
            cursor: "grab",
          }}
        >
          {dragHandle}
        </span>

        <span
          className={classNames(
            { "fs-md text-decoration-line-through": item.disabled },
            {
              // Diff isn't defined at first so we have to default to empty here
              // Note: Also defined as `object` by them so not much else we can do but ignore
              // @ts-expect-error
              "fst-italic": Object.keys(status?.updated.items ?? {}).includes(
                `${idx}`
              ),
            }
          )}
          role="button"
          style={{
            // Make text color opaque when disabled
            // Adding opacity to the entire element causes it to "shine through" to anything above it
            // which is problematic for the search bar 🫠
            color: item.disabled ? "rgba(0, 0, 0, 0.3)" : "",
          }}
        >
          {item.name} - ${formatItemPrice(item)}
        </span>
        <span className="ms-auto" style={{ cursor: "pointer" }}>
          {open ? <ChevronUp size="18" /> : <ChevronDown size="18" />}
          <span className="border-start mx-2" />
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
    select: {
      id: true,
      idx: true,
      name: true,
      description: true,
      course: true,
      disabled: true,
      price: {
        select: {
          id: true,
          lunch: true,
          dinner: true,
          drinks: true,
          dessert: true,
        },
      },
    },
  });

  return {
    props: {
      menu,
    },
  };
};
