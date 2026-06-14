import { validationSchema } from "@/pages/admin/info/edit";
import { contact, hours, info } from "@/lib/db/schema";
import { days } from "@/lib/hooks/useInfo";
import { TRPCError } from "@trpc/server";
import { asc, eq } from "drizzle-orm";

import { protectedProcedure, createTRPCRouter } from "../trpc";

export const infoRouter = createTRPCRouter({
  update: protectedProcedure.input(validationSchema).mutation(async (opts) => {
    const { input, ctx } = opts;

    try {
      await ctx.db.transaction(async (tx) => {
        await tx
          .update(info)
          .set({ about: input.about })
          .where(eq(info.id, input.id));

        await tx
          .update(contact)
          .set({
            address: input.contact.address,
            phone: input.contact.phone,
            email: input.contact.email,
          })
          .where(eq(contact.id, input.contactId));

        for (const hour of input.hours) {
          await tx
            .update(hours)
            .set({
              open: hour.open ?? "",
              close: hour.close ?? "",
            })
            .where(eq(hours.id, hour.id));
        }
      });

      const [infoRow] = await ctx.db
        .select()
        .from(info)
        .where(eq(info.id, input.id))
        .limit(1);

      if (!infoRow) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Info not found" });
      }

      const [contactRow] = await ctx.db
        .select()
        .from(contact)
        .where(eq(contact.id, infoRow.contactId))
        .limit(1);

      if (!contactRow) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Contact row missing for info",
        });
      }

      const hoursRows = await ctx.db
        .select()
        .from(hours)
        .where(eq(hours.infoId, input.id));

      const hoursSorted = hoursRows.toSorted(
        (a, b) => days.indexOf(a.day) - days.indexOf(b.day)
      );

      const updatedInfo = {
        ...infoRow,
        contact: contactRow,
        hours: hoursSorted,
      };

      return {
        ok: true,
        data: updatedInfo,
        error: null,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      if (typeof error === "string") {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error });
      }
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
});
