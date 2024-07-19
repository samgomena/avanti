import { vi } from "vitest";
import { appRouter } from "../root";
import { createInnerTRPCContext } from "../trpc";

test.skip("protected example router", async () => {
  const ctx = createInnerTRPCContext({
    session: {
      user: { name: "John Doe", email: "email@example.com" },
      expires: "1",
    },
  });
  const caller = appRouter.createCaller(ctx);

  vi.stubEnv("NODE_ENV", "development");
  const res = await caller.people.create({
    name: "testuser1",
    email: "email@example.com",
  });

  expect(res.ok);
  expect(res.data).toMatchObject({
    name: "testuser1",
    email: "email@example.com",
    emailVerified: null,
  });
});
