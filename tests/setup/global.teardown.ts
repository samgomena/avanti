import { db } from "@/server/db";
import { test as teardown } from "@playwright/test";
import { testUserEmail } from "./constants";

teardown("delete database", async () => {
  console.log("deleting test database...");
  await db.user.delete({
    where: {
      email: testUserEmail,
    },
  });
});
