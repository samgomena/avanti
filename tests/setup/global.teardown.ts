import { test as teardown } from "@playwright/test";
import { eq } from "drizzle-orm";

import { drizzleDb, libsqlClient } from "@/lib/db/libsql";
import { account, session, user, verification } from "@/lib/db/schema";

import { testUserEmail } from "./constants";

function assertTestDatabase() {
  const connectionString =
    process.env.LIBSQL_URL ??
    process.env.TURSO_DATABASE_URL ??
    "file:./data/local.db";

  if (
    !connectionString.startsWith("file:") &&
    !["localhost", "127.0.0.1", "test"].some((host) => connectionString.includes(host))
  ) {
    throw new Error(
      `Not connected to a local/test libSQL database AFAICT (${connectionString}). Aborting...`
    );
  }
}

teardown("delete database", async () => {
  try {
    assertTestDatabase();

    const [testUser] = await drizzleDb
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, testUserEmail))
      .limit(1);

    await drizzleDb.transaction(async (tx) => {
      await tx
        .delete(verification)
        .where(eq(verification.identifier, testUserEmail));

      if (!testUser) {
        return;
      }

      await tx.delete(session).where(eq(session.userId, testUser.id));
      await tx.delete(account).where(eq(account.userId, testUser.id));
      await tx.delete(user).where(eq(user.id, testUser.id));
    });
  } finally {
    libsqlClient.close();
  }
});
