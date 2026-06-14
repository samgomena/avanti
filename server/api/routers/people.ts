import { validationSchema } from "@/pages/admin/people";
import { account, session, user } from "@/lib/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure, createTRPCRouter } from "../trpc";

export const peopleRouter = createTRPCRouter({
  create: protectedProcedure.input(validationSchema).mutation(async (opts) => {
    const { input, ctx } = opts;

    try {
      const id = crypto.randomUUID();
      const now = new Date();

      const [newUser] = await ctx.db
        .insert(user)
        .values({
          id,
          name: input.name,
          email: input.email,
          emailVerified: false,
          image: null,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

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

    if (!input.id) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "User id required" });
    }

    try {
      const [updatedUser] = await ctx.db
        .update(user)
        .set({
          name: input.name,
          email: input.email,
          updatedAt: new Date(),
        })
        .where(eq(user.id, input.id))
        .returning();

      if (!updatedUser) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      return {
        ok: true,
        data: updatedUser,
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
        const [existing] = await ctx.db
          .select()
          .from(user)
          .where(eq(user.id, input.id))
          .limit(1);

        if (!existing) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        await ctx.db.delete(session).where(eq(session.userId, input.id));
        await ctx.db.delete(account).where(eq(account.userId, input.id));
        await ctx.db.delete(user).where(eq(user.id, input.id));

        return {
          ok: true,
          error: null,
          data: existing,
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
