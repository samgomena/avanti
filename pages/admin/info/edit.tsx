import SubmitResetButtons from "@/components/Form/SubmitResetButtons";
import type { Contact, Days } from "@prisma/client";
import { Form, Formik } from "formik";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import BeforeUnload from "../../../components/Form/BeforeUnload";
import Field from "../../../components/Form/FieldWithError";
import HoursField from "../../../components/Form/HoursField";
import { days } from "../../../lib/hooks/useInfo";
import { db } from "@/server/db";
import { capitalize } from "../../../lib/utils/utils";
import withAdminNav from "../../../lib/withAdminNav";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { api } from "@/lib/api";
import { toast } from "sonner";
import PhoneField from "@/components/Form/PhoneField";

export const validationSchema = z.object({
  about: z.string({ error: "This is required!" }),
  contact: z.object({
    address: z.string({ error: "An address is required!" }),
    phone: z
      .string({ error: "A phone number is required!" })
      .regex(
        /^\(?(\d\d\d)\)?-?(\d\d\d)-?(\d\d\d\d)$/g,
        "That's not a valid phone number!\nTip: Don't add a country code!"
      ),
    email: z
      .string({ error: "An email is required!" })
      .email("That's not a valid email address!"),
  }),
  hours: z
    .array(
      z.object({
        id: z.string(),
        day: z.enum(days),
        // open and close are optional iff they're both undefined.
        // Below, we do the error handling for when one or the other is not.
        open: z.string().optional(),
        close: z.string().optional(),
      })
    )
    // We (have to) use superRefine here to specify errors messages on the specific day that has an error
    .superRefine((data, ctx) => {
      data.forEach(({ open, close }, idx) => {
        // Hours are valid iff an opening and closing are either both defined or neither defined...
        // So, we convert to boolean and check if they're the same
        // Javascript doesn't have logical XOR which is why this looks so fucked up
        if (!open !== !close) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: !open
              ? "An opening time is required if there's a closing time"
              : "A closing time is required if there's an opening time",
            path: [idx, !open ? "open" : "close"],
          });
        }
      });
    }),
  // Supplemental fields:
  // These are returned by prisma and we keep them in formik state because they're required by the backend
  id: z.string(),
  contactId: z.string(),
});

// In the future it would be nice to use InferFromGetStaticProps or whatever but it doesn't seem like there's a way to export the database type from prisma
export type EditInfoProps = {
  info: {
    id: string;
    about: string;
    contact: Contact;
    contactId: string;
    hours: {
      id: string;
      open: string;
      close: string;
      day: Days;
    }[];
  };
};

const EditInfo: React.FC<EditInfoProps> = ({ info }) => {
  const router = useRouter();

  const mutation = api.info.update.useMutation({
    onSuccess: () => {
      console.info("Successfully updated info");
      // Refresh the dataz
      router.replace(router.asPath);
      toast.success("Sucess", {
        description:
          "Site information updated successfully! You're changes should be visible in a few seconds",
      });
    },
    onError: (error) => {
      console.error(`There was an error submitting info: ${error}`);
      toast.error("Uh oh.", {
        description: "There was an error updating info. Maybe try again 🙃",
      });
    },
  });

  const onSubmit = async (values: typeof info) => {
    mutation.mutate(values);
  };

  return (
    <div className="row justify-content-center">
      <div className="col">
        <h3>Edit site information</h3>
        <Formik<typeof info>
          initialValues={info}
          enableReinitialize // Resets form state after successful update (i.e. disables submit/reset buttons)
          onSubmit={(data) => onSubmit(data)}
          validationSchema={toFormikValidationSchema(validationSchema)}
        >
          {({ isSubmitting, values, isValid, dirty, setFieldValue }) => (
            <Form className="needs-validation" noValidate>
              <BeforeUnload />
              <div className="col">
                <Field
                  name="about"
                  placeholder="About"
                  as="textarea"
                  rows={3}
                />

                <Field name="contact.address" placeholder="Address" />
                <PhoneField name="contact.phone" placeholder="Phone number" />
                <Field name="contact.email" placeholder="Email" />
                {/* <Field name="contact.phone" placeholder="Phone number" /> */}

                {values?.hours.map((entry, idx) => (
                  <div key={entry.day} className="form-group mb-3">
                    <label>
                      {capitalize(entry.day)}
                      {(entry.open !== "" || entry.close !== "") && (
                        <HoursField idx={idx} />
                      )}
                      <div className="form-check">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            // Was open and now closed
                            if (e.target.checked) {
                              setFieldValue(`hours[${idx}]`, {
                                ...entry,
                                open: "",
                                close: "",
                              });
                            } else {
                              // Was closed and now open
                              setFieldValue(`hours[${idx}]`, {
                                ...entry,
                                open: "12:00",
                                close: "12:00",
                              });
                            }
                          }}
                          checked={entry.open === "" && entry.close === ""}
                          className="form-check-input"
                          id={`closed-${entry.day}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`closed-${entry.day}`}
                        >
                          Closed on {capitalize(entry.day)}
                        </label>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <SubmitResetButtons
                isValid={isValid}
                isSubmitting={isSubmitting || mutation.isPending}
                dirty={dirty}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default withAdminNav(EditInfo);

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

  const info = await db.info.findFirst({
    include: {
      contact: true,
      hours: true,
    },
  });

  // Sort hours by day of week
  const hours = info?.hours.toSorted(
    (a, b) => days.indexOf(a.day) - days.indexOf(b.day)
  );

  return {
    props: {
      info: { ...info, hours },
    },
  };
};
