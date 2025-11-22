import { TRPCError, initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { Session } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/server/db";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/pages/api/auth/[...nextauth]";

type CreateContextOptions = {
  session: Session | null;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerSession(req, res, authConfig);

  return createInnerTRPCContext({
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use((opts) => {
  const { ctx, next } = opts;

  // TODO: Pin to dev server until we have more tests
  // if (process.env.NODE_ENV !== "development") {
  //   throw new TRPCError({ code: "UNAUTHORIZED" });
  // }

  // TODO: Only allow updates?
  // if (ctx.req.method !== "POST") {
  //   throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" });
  // }

  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
