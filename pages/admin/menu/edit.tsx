import Collapse from "react-bootstrap/Collapse";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {
  ErrorMessage,
  FieldArray,
  Form,
  Formik,
  useFormikContext,
  type FormikHelpers,
} from "formik";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { z } from "zod";
import { api } from "@/lib/api";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { SortableList } from "@/components/DnD/SortableList";
import { closestCenter } from "@dnd-kit/core";
import type { CollisionDetection } from "@dnd-kit/core";
import BeforeUnload from "@/components/Form/BeforeUnload";
import FieldWithError from "@/components/Form/FieldWithError";
import FormError from "@/components/Form/FormError";
import PriceField from "@/components/Form/PriceField";
import SubmitResetButtons from "@/components/Form/SubmitResetButtons";
import FilterToggle from "@/components/Menu/FilterToggle";
import HelpModal from "@/components/Menu/HelpModal";
import { formatItemPrice } from "@/lib/utils/utils";
import { Courses, type Menu, type Price } from "@prisma/client";
import classNames from "classnames";
import { type DetailedDiff, detailedDiff } from "deep-object-diff";
import { getSession } from "next-auth/react";
import type { GetServerSideProps } from "next/types";
import { ChevronDown, ChevronUp, EyeOff, X } from "react-feather";
import { db } from "@/server/db";
import withAdminNav from "../../../lib/withAdminNav";
import { toast } from "sonner";

const initialValue = {
  name: "",
  description: "",
  course: "appetizer" as Courses,
  price: {
    // This is stupid but the easiest solution. Because we use a number input below (and our validation schema is typed as a number)
    // we have to cast the value to number. We store the initial values as empty strings here because we don't want to show an initial 0
    // in the input box. Which is because we don't want end users submitting prices of 0 for stuff.
    lunch: "" as unknown as number,
    dinner: "" as unknown as number,
    hh: "" as unknown as number,
    dessert: "" as unknown as number,
    drinks: "" as unknown as number,
  },
  disabled: false,
};

export const validationSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string({ required_error: "A name for this item is required!" }),
        description: z.string().optional(),
        course: z.nativeEnum(Courses),
        price: z.object({
          lunch: z.string().optional(),
          dinner: z.string().optional(),
          hh: z.string().optional(),
          dessert: z.string().optional(),
          drinks: z.string().optional(),
          id: z.string(),
        }),
        disabled: z.boolean(),
        id: z.string(),
      })
    )
    // Use `superRefine` here to handle special cases for prices on different courses
    // specifically, we care about enforcing a price on either lunch or dinner for appetizers and entrees
    .superRefine((data, ctx) => {
      data.forEach((item, idx) => {
        switch (item.course) {
          case "appetizer":
          case "entree":
            if (!item.price.lunch && !item.price.dinner) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "A price is required for either lunch or dinner",
                path: [idx, "price", "lunch"],
              });
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "A price is required for either lunch or dinner",
                path: [idx, "price", "dinner"],
              });
            }
            break;
          case "dessert":
            if (!item.price.dessert) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "A price is required for this course",
                path: [idx, "price", "dessert"],
              });
            }
            break;
          case "drink":
            if (!item.price.drinks) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "A price is required for this course",
                path: [idx, "price", "drinks"],
              });
            }
            break;
        }
      });
    }),
});

export type MenuWithPrice = Menu & {
  price: Price;
  mvIdx: number;
};

type EditMenuProps = {
  menu: MenuWithPrice[];
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
  /* eslint-disable react-hooks/exhaustive-deps */
  // biome-ignore lint/correctness/useExhaustiveDependencies: setDiff comes from useState and thus already memoized??
  useEffect(() => setDiff(_diff), [_diff]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return null;
};

// Custom collision detection that only allows dropping within the same course
const createCourseRestrictedCollisionDetection = (
  items: MenuWithPrice[]
): CollisionDetection => {
  return (args) => {
    const { active, droppableContainers } = args;

    // Find the active item (the one being dragged)
    const activeItem = items.find((item) => item.id === active.id);
    if (!activeItem) {
      return closestCenter(args);
    }

    // Filter droppable containers to only include items from the same course
    const sameCourseContainers = droppableContainers.filter((container) => {
      const containerItem = items.find((item) => item.id === container.id);
      return containerItem?.course === activeItem.course;
    });

    // Call the default collision detection with filtered containers
    return closestCenter({
      ...args,
      droppableContainers: sameCourseContainers,
    });
  };
};

const EditMenu: React.FC<EditMenuProps> = ({ menu }) => {
  const dryRun = false;

  const [filter, setFilter] = useState<Record<Courses, boolean>>({
    appetizer: false,
    entree: false,
    drink: false,
    dessert: false,
  });

  const [toggle, setToggle] = useState({
    disabled: false,
  });

  const [originalToggleState, setOriginalToggleState] = useState<{
    disabled: boolean;
  } | null>(null);

  const [searchText, setSearchText] = useState("");
  const [removed, setRemoved] = useState<Array<{ id: string; idx: number }>>(
    []
  );

  const [diff, setDiff] = useState<DetailedDiff | undefined>(undefined);

  const deleteMutation = api.menu.delete.useMutation({
    onSuccess: console.info,
    onError: console.error,
  });

  const updateMutation = api.menu.edit.useMutation({
    onError: (error) => {
      console.error(
        `There was an error (from the server) updating items: ${error}`
      );
      toast.error("Uh oh!", {
        description: "There was an error while updating... Maybe try again? 🙃",
      });
    },
  });

  const onSubmit = async (
    values: {
      items: MenuWithPrice[];
    },
    { resetForm }: FormikHelpers<{ items: MenuWithPrice[] }>
  ) => {
    // TODO: Maybe expose this as an option in the UI?
    // TODO: Could potentially show a preview/diff of the changes?
    if (dryRun) {
      return;
    }

    const removedItems = removed.map(({ id, idx }) => ({
      id,
      idx,
      operation: "delete" as const,
    }));

    // @ts-expect-error: We can't type the diff object any more concretely than `unknown` currently
    const valuesWithNewIdx = Object.entries(diff?.updated.items ?? {}).map(
      ([key, value]) => {
        // key is the index (from the db) of the item that we want to update
        const currentItem = values.items[Number(key)];
        // If price is in the diff, ensure we include price.id from current values
        // The server needs price.id to know which Price record to update
        const data = {
          ...(value as Record<string, unknown>),
          idx: Number(key),
        };
        // @ts-expect-error: We can't type the value object b/c the diff object doesn't let up
        if (data.price && currentItem.price?.id) {
          // @ts-expect-error: We can't type the value object b/c the diff object doesn't let up
          data.price.id = currentItem.price.id;
        }
        const obj = {
          id: currentItem.id,
          operation: "update" as const,
          // @ts-expect-error: We can't type the value object b/c the diff object doesn't let up
          data: data as MenuItemWithPrice,
        };
        return obj;
      }
    );

    updateMutation.mutate([...removedItems, ...valuesWithNewIdx], {
      onSuccess: (res) => {
        resetForm({
          values: { items: res.data.menu as MenuWithPrice[] },
        });
        toast.success("Sucess", {
          description: "You're changes should be visible in a few seconds",
        });
      },
    });
  };

  // This is a helper function that augements the remove function from Formik's FieldArray.
  // Formik removes items from it's internal state when they're removed (obvi) so we have to
  // additionally store the removed item ids separately so we can send them to the API when be deleted.
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
            validationSchema={toFormikValidationSchema(validationSchema)}
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
                      collisionDetection={createCourseRestrictedCollisionDetection(
                        values.items
                      )}
                      onDragStart={() => {
                        // Save the current toggle state and show all disabled items
                        setOriginalToggleState(toggle);
                        setToggle({ disabled: false });
                      }}
                      onDragEnd={() => {
                        // Restore the original toggle state
                        if (originalToggleState) {
                          setToggle(originalToggleState);
                          setOriginalToggleState(null);
                        }
                      }}
                      onChange={(activeIndex, overIndex) => {
                        move(activeIndex, overIndex);
                      }}
                      renderItem={(item: MenuWithPrice) => (
                        <SortableList.Item id={item.id}>
                          <div
                            className={classNames(
                              "group",
                              // Filtering logic
                              {
                                // Don't filter items if there are *no* fitlers applied -- otherwise filter that ish
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
                              <div className="d-flex">
                                <hr style={{ flex: 1, width: "50%" }} />
                                <div className="d-flex justify-center items-center group-hover opacity-0 opacity-100-hover">
                                  <button
                                    onClick={() => {
                                      insert(item.mvIdx + 1, {
                                        ...initialValue,
                                        course: item.course,
                                        idx: item.mvIdx + 1,
                                      });
                                    }}
                                    type="button"
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
                                    width: "50%",
                                    alignItems: "end",
                                  }}
                                />
                              </div>
                            </div> */}
                            <hr
                              style={{
                                flex: 1,
                                // Make hr wider between different course sections
                                borderWidth: (() => {
                                  const currentIdx = item.mvIdx;
                                  // Helper function to check if an item would be visible
                                  const isItemVisible = (
                                    checkItem: MenuWithPrice
                                  ) => {
                                    const isFilteredOut =
                                      Object.values(filter).some(Boolean) &&
                                      !filter[checkItem.course];
                                    const isHiddenByToggle =
                                      checkItem.disabled && toggle.disabled;
                                    const isHiddenBySearch =
                                      checkItem.name
                                        .toLowerCase()
                                        .indexOf(searchText) === -1;
                                    return (
                                      !isFilteredOut &&
                                      !isHiddenByToggle &&
                                      !isHiddenBySearch
                                    );
                                  };

                                  // Check if there are any more visible items from the same course after this one
                                  const hasMoreVisibleItemsInSameCourse =
                                    values.items
                                      .slice(currentIdx)
                                      .some((nextItem) => {
                                        return (
                                          isItemVisible(nextItem) &&
                                          nextItem.course === item.course
                                        );
                                      });

                                  // Show thick border if this is the last visible item in its course
                                  // or if the next visible item is from a different course
                                  return hasMoreVisibleItemsInSameCourse
                                    ? "1px"
                                    : "3px";
                                })(),
                              }}
                            />
                          </div>
                        </SortableList.Item>
                      )}
                    />
                  )}
                </FieldArray>
                <SubmitResetButtons
                  isValid={isValid}
                  isSubmitting={
                    deleteMutation.isPending || updateMutation.isPending
                  }
                  dirty={dirty}
                />
              </Form>
            )}
          </Formik>
        </DiffStatus.Provider>
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
  const { diff: status } = useContext(DiffStatus);
  const { setFieldValue } = useFormikContext();
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
        // Lets spacebar toggle open/close states
        onKeyDown={(e) => e.key === " " && setOpen(!open)}
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
            color: item.disabled === true ? "rgba(0, 0, 0, 0.3)" : "",
          }}
        >
          {item.name} - ${formatItemPrice(item)}
        </span>
        <span className="ms-auto d-flex" style={{ cursor: "pointer" }}>
          {open ? <ChevronUp size="18" /> : <ChevronDown size="18" />}
          <span className="border-start mx-2" />
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Remove {item.name}</Tooltip>}
          >
            <X onClick={() => remove({ idx, id: item.id })} size={18} />
          </OverlayTrigger>
          <span className="mx-1" />
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Hide {item.name}</Tooltip>}
          >
            <EyeOff
              onClick={(e) => {
                e.stopPropagation();
                setFieldValue(`items.${idx}.disabled`, !item.disabled);
              }}
              size={16}
            />
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
                    <PriceField key="lunch" service="lunch" idx={idx} />,
                    <PriceField key="dinner" service="dinner" idx={idx} />,
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
  const menu = await db.menu.findMany({
    orderBy: [{ course: "asc" }, { idx: "asc" }],
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
