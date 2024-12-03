import { db } from "@/server/db";
import { test as setup } from "@playwright/test";
import { testUserName, testUserEmail } from "./constants";

setup("Create Test User Account", async () => {
  await db.user.create({
    data: {
      name: testUserName,
      email: testUserEmail,
    },
  });
});
