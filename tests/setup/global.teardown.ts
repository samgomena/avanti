import { db } from "@/server/db";
import { test as teardown } from "@playwright/test";
import { testUserEmail } from "./constants";

teardown("delete database", async () => {
  const connectionString = process.env.DATABASE_URL;
  if (
    !connectionString?.includes("/avanti:dev") ||
    !connectionString?.includes("localhost:5432/test")
  ) {
    throw new Error("Not connected to test database. Aborting...");
  }

  console.log("deleting test database...");
  await db.user.delete({
    where: {
      email: testUserEmail,
    },
  });
});
