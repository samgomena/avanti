import { validationSchema } from "@/pages/admin/people";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const peopleRouter = createTRPCRouter({
  create: protectedProcedure.input(validationSchema).mutation(async (opts) => {
    const { input, ctx } = opts;

    try {
      const newUser = await ctx.db.user.create({
        data: {
          email: input.email,
          name: input.name,
          emailVerified: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return {
        ok: true,
        data: newUser,
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
      const updatedUser = await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
          updatedAt: new Date(),
        },
      });

      return {
        ok: true,
        data: updatedUser,
        error: null,
      };
    } catch (error) {
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
        const adapter = PrismaAdapter(ctx.db);
        // Note: `deleteUser` is defined for the prisma adapter
        // See: https://github.com/nextauthjs/next-auth/blob/a7a48a142f47e4c03d39df712a2bf810342cf202/packages/adapter-prisma/src/index.ts#L46
        const deleted = await adapter.deleteUser?.(input.id);

        // Alternatively, can use something like this instead if the above doesn't work for some reason
        // The benefit of the above is the adapter invalidates sessions on delete
        // const deleted = await prisma.user.delete({ where: { id: userId } });

        return {
          ok: true,
          error: null,
          data: deleted,
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
