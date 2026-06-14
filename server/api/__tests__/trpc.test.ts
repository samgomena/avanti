import { describe, expect, it } from "vitest";

import { appRouter } from "../root";
import { createInnerTRPCContext } from "../trpc";

describe("protectedProcedure", () => {
  it("rejects callers without a session", async () => {
    const caller = appRouter.createCaller(
      createInnerTRPCContext({ session: null })
    );

    await expect(caller.alerts.delete({ id: "any-id" })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("rejects callers whose session has no user", async () => {
    const caller = appRouter.createCaller(
      createInnerTRPCContext({
        session: { user: null, session: null } as never,
      })
    );

    await expect(caller.alerts.delete({ id: "any-id" })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});
