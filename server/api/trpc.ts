import { TRPCError, initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";

import { auth } from "@/lib/auth";
import { getAuthSessionFromHeaders } from "@/lib/auth-session";
import { db } from "@/server/db";

type AuthSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

type CreateContextOptions = {
  session: AuthSession | null;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req } = opts;

  const session = await getAuthSessionFromHeaders(req.headers);

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
      session: ctx.session,
    },
  });
});
