import { validationSchema } from "@/pages/admin/alerts";
import { alert } from "@/lib/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure, createTRPCRouter } from "../trpc";

export const alertsRouter = createTRPCRouter({
  create: protectedProcedure.input(validationSchema).mutation(async (opts) => {
    const { input, ctx } = opts;

    try {
      const id = input.id ?? crypto.randomUUID();
      const [row] = await ctx.db
        .insert(alert)
        .values({
          id,
          start: new Date(input.start),
          end: new Date(input.end),
          title: input.title,
          text: input.text,
        })
        .returning();

      return {
        ok: true,
        data: row,
        error: null,
      };
    } catch (error) {
      if (typeof error === "string") {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error });
      }
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
  update: protectedProcedure.input(validationSchema).mutation(async (opts) => {
    const { input, ctx } = opts;

    if (!input.id) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Alert id required" });
    }

    try {
      const [row] = await ctx.db
        .update(alert)
        .set({
          start: new Date(input.start),
          end: new Date(input.end),
          title: input.title,
          text: input.text,
        })
        .where(eq(alert.id, input.id))
        .returning();

      if (!row) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Alert not found" });
      }

      return {
        ok: true,
        data: row,
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

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const { input, ctx } = opts;

      try {
        const [deleted] = await ctx.db
          .delete(alert)
          .where(eq(alert.id, input.id))
          .returning();

        if (!deleted) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Alert not found" });
        }

        return {
          ok: true,
          data: deleted,
          error: null,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        if (typeof error === "string") {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error,
          });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});
