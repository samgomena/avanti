import { db } from "@/server/db";
import { test as setup } from "@playwright/test";
import { testUserName, testUserEmail } from "./constants";

setup("Create Test User Account", async () => {
  const connectionString = process.env.DATABASE_URL;
  if (
    !connectionString?.includes("/avanti:dev") ||
    !connectionString?.includes("localhost:5432/test")
  ) {
    throw new Error("Not connected to test database. Aborting...");
  }

  await db.user.create({
    data: {
      name: testUserName,
      email: testUserEmail,
    },
  });
});
