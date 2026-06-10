import { randomUUID } from "node:crypto";

import { test as setup } from "@playwright/test";
import { eq } from "drizzle-orm";

import { drizzleDb, libsqlClient } from "@/lib/db/libsql";
import { user } from "@/lib/db/schema";

import { testUserName, testUserEmail } from "./constants";

function assertTestDatabase() {
  const connectionString =
    process.env.LIBSQL_URL ??
    process.env.TURSO_DATABASE_URL ??
    "file:./data/local.db";

  if (
    !connectionString.startsWith("file:") &&
    !connectionString.includes("localhost") &&
    !connectionString.includes("127.0.0.1") &&
    !connectionString.includes("test")
  ) {
    throw new Error(
      `Not connected to a local/test libSQL database (${connectionString}). Aborting...`
    );
  }
}

setup("Create Test User Account", async () => {
  try {
    assertTestDatabase();

    await drizzleDb
      .insert(user)
      .values({
        id: randomUUID(),
        name: testUserName,
        email: testUserEmail,
        emailVerified: false,
      })
      .onConflictDoUpdate({
        target: user.email,
        set: {
          name: testUserName,
          emailVerified: false,
          updatedAt: new Date(),
        },
      });
  } finally {
    libsqlClient.close();
  }
});
