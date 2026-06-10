import { randomUUID } from "node:crypto";

import { drizzleDb, libsqlClient } from "../lib/db/libsql";
import {
  contact as contactTable,
  hours as hoursTable,
  info as infoTable,
  type Day,
} from "../lib/db/schema";

const seedHours: Array<{ day: Day; open: string; close: string }> = [
  { day: "monday", open: "", close: "" },
  { day: "tuesday", open: "16:00", close: "21:00" },
  { day: "wednesday", open: "16:00", close: "21:00" },
  { day: "thursday", open: "16:00", close: "21:00" },
  { day: "friday", open: "16:00", close: "22:00" },
  { day: "saturday", open: "16:00", close: "22:00" },
  { day: "sunday", open: "16:00", close: "21:00" },
];

async function main() {
  const [existingInfo] = await drizzleDb
    .select({ id: infoTable.id })
    .from(infoTable)
    .limit(1);

  if (existingInfo) {
    return;
  }

  const contactId = randomUUID();
  const infoId = randomUUID();

  await drizzleDb.transaction(async (tx) => {
    await tx.insert(contactTable).values({
      id: contactId,
      email: "test@example.com",
      address: "123 Example St.",
      phone: "123-456-7890",
      instagram: "https://www.instagram.com/example",
      facebook: "https://www.facebook.com/example",
    });

    await tx.insert(infoTable).values({
      id: infoId,
      about: "Another example description",
      contactId,
    });

    await tx.insert(hoursTable).values(
      seedHours.map((entry) => ({
        id: randomUUID(),
        infoId,
        ...entry,
      }))
    );
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    libsqlClient.close();
  });
