import { validationSchema } from "@/pages/admin/alerts";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";

export const alertsRouter = createTRPCRouter({
  create: protectedProcedure.input(validationSchema).mutation(async (opts) => {
    const { input, ctx } = opts;

    try {
      const alert = await ctx.db.alert.create({
        data: {
          ...input,
          start: new Date(input.start),
          end: new Date(input.end),
        },
      });

      return {
        ok: true,
        data: alert,
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

    try {
      const updated = await ctx.db.alert.update({
        data: {
          ...input,
          start: new Date(input.start),
          end: new Date(input.end),
        },
        where: {
          id: input.id,
        },
      });

      return {
        ok: true,
        data: updated,
        error: null,
      };
    } catch (error) {
      if (typeof error === "string") {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error });
      }
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),

  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async (opts) => {
    const { input, ctx } = opts;

    try {
      const deleted = await ctx.db.alert.delete({
        where: {
          id: input.id,
        },
      });
      return {
        ok: true,
        data: deleted,
        error: null,
      };
    } catch (error) {
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
