import PriceField from "@/components/Form/PriceField";
import SubmitResetButtons from "@/components/Form/SubmitResetButtons";
import { api } from "@/lib/api";
import { Courses } from "@prisma/client";
import {
  ErrorMessage,
  FieldArray,
  Form,
  Formik,
  type FormikHelpers,
} from "formik";
import { getSession } from "next-auth/react";
import type { GetServerSideProps } from "next/types";
import type React from "react";
import Button from "react-bootstrap/Button";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import BeforeUnload from "../../../components/Form/BeforeUnload";
import FieldWithError from "../../../components/Form/FieldWithError";
import FormError from "../../../components/Form/FormError";
import type { Item } from "../../../lib/types/menu";
import { inflect } from "../../../lib/utils/utils";
import withAdminNav from "../../../lib/withAdminNav";
import { toast } from "sonner";

const initialValue: Item = {
  name: "",
  description: "",
  course: "entree",
  service: [],
  price: {
    // This is stupid but the easiest solution. Because we use a number input below (and our validation schema is typed as a number)
    // we have to cast the value to number. We store the initial values as empty strings here because we don't want to show an initial 0
    // in the input box. Which is because we don't want end users submitting prices of 0 for stuff.
    lunch: "", // as unknown as number,
    dinner: "", // as unknown as number,
    hh: "", // as unknown as number,
    dessert: "", // as unknown as number,
    drinks: "", // as unknown as number,
  },
};

export const validationSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string({ error: "A name for this item is required!" }),
        description: z.string().optional(),
        course: z.enum(Courses),
        price: z.object({
          lunch: z.string().optional(),
          dinner: z.string().optional(),
          hh: z.string().optional(),
          dessert: z.string().optional(),
          drinks: z.string().optional(),
        }),
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

const initialValues: { items: Item[] } = {
  items: [initialValue],
};

const AddMenuItem: React.FC = () => {
  const mutation = api.menu.add.useMutation({
    onSuccess: () => {
      console.info("Successfully added menu item");
      toast.success("Sucess", {
        description: "You're changes should be visible in a few seconds",
      });
    },
    onError: (error) => {
      console.error(
        `There was an error (from the server) submitting info: ${error}`
      );
      toast.error("Uh oh.", {
        description: "There was an error creating that. Maybe try again 🙃",
      });
    },
  });

  const onSubmit = (
    values: z.infer<typeof validationSchema>,
    {
      resetForm,
    }: FormikHelpers<{
      items: Item[];
    }>
  ) => {
    mutation.mutate(values, {
      onSuccess: () => resetForm(),
    });
  };

  return (
    <div>
      <h3>Add new menu items</h3>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={toFormikValidationSchema(validationSchema)}
        onSubmit={onSubmit}
      >
        {({ values, isValid, dirty }) => (
          <Form className="needs-validation" noValidate>
            <BeforeUnload />
            <FieldArray name="items">
              {({ remove, push }) => (
                <div className="row mb-3">
                  {values.items.map((item, idx1, { length }) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <div className="row gx-3 mb-3" key={idx1}>
                      <div className="col-12 col-md-10">
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
                          variant="outline-light"
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
              isSubmitting={mutation.isPending}
              dirty={dirty}
              submitText={`Add ${inflect("item")(values.items.length)}`}
            />
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
