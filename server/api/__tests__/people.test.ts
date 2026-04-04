import { vi } from "vitest";
import { appRouter } from "../root";
import { createInnerTRPCContext } from "../trpc";

test.skip("protected example router", async () => {
  const ctx = createInnerTRPCContext({
    session: {
      user: {
        id: "user-1",
        name: "John Doe",
        email: "email@example.com",
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      session: {
        id: "sess-1",
        userId: "user-1",
        expiresAt: new Date(),
        token: "token",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
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
    emailVerified: false,
  });
});
