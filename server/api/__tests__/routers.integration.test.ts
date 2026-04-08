import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { asc, eq } from "drizzle-orm";
import { execSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  contact,
  hours,
  info,
  menu,
  price,
  sqliteSchema,
} from "@/lib/db/schema";
import type { AppDrizzleDatabase } from "@/lib/db/libsql";
import type { Hours } from "@/lib/db/types";
import { days } from "@/lib/hooks/useInfo";

import { appRouter } from "../root";
import { createInnerTRPCContext } from "../trpc";

const sessionFixture = {
  user: {
    id: "user-it-1",
    name: "Integration",
    email: "it@example.com",
    emailVerified: true,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  session: {
    id: "sess-it-1",
    userId: "user-it-1",
    expiresAt: new Date(),
    token: "token-it",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
} as const;

describe.sequential("tRPC routers (Drizzle, isolated DB)", () => {
  let tmpDir: string;
  let libsqlUrl: string;
  let testDb: AppDrizzleDatabase;
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    tmpDir = mkdtempSync(path.join(tmpdir(), "avanti-trpc-it-"));
    const dbFile = path.join(tmpDir, "integration.db");
    libsqlUrl = pathToFileURL(dbFile).href;

    execSync("bunx drizzle-kit push", {
      cwd: process.cwd(),
      stdio: "inherit",
      env: {
        ...process.env,
        LIBSQL_URL: libsqlUrl,
        TURSO_DATABASE_URL: "",
        LIBSQL_AUTH_TOKEN: "",
        TURSO_AUTH_TOKEN: "",
      },
    });

    const client = createClient({ url: libsqlUrl });
    testDb = drizzle(client, { schema: sqliteSchema });

    caller = appRouter.createCaller(
      createInnerTRPCContext({
        session: sessionFixture as never,
        db: testDb,
      })
    );
  }, 120_000);

  afterAll(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it("alerts: create, update, delete", async () => {
    const created = await caller.alerts.create({
      start: "2026-01-01",
      end: "2026-01-31",
      title: "T",
      text: "Body",
    });
    expect(created.ok).toBe(true);
    expect(created.data?.id).toBeDefined();

    const id = created.data!.id;

    const updated = await caller.alerts.update({
      id,
      start: "2026-02-01",
      end: "2026-02-28",
      title: "T2",
      text: "Body2",
    });
    expect(updated.ok).toBe(true);
    expect(updated.data?.title).toBe("T2");

    const deleted = await caller.alerts.delete({ id });
    expect(deleted.ok).toBe(true);
    expect(deleted.data?.id).toBe(id);
  });

  it("info: update contact, about, and hours", async () => {
    const contactId = "contact-it-1";
    const infoId = "info-it-1";

    await testDb.insert(contact).values({
      id: contactId,
      address: "1 Main",
      email: "r@example.com",
      phone: "5035550100",
      facebook: "https://fb",
      instagram: "https://ig",
    });

    await testDb.insert(info).values({
      id: infoId,
      about: "Hello",
      contactId,
    });

    const hourRows = days.map((day, i) => ({
      id: `hour-it-${i}`,
      day,
      open: day === "monday" ? "" : "11:00",
      close: day === "monday" ? "" : "22:00",
      infoId,
    }));

    await testDb.insert(hours).values(hourRows);

    const res = await caller.info.update({
      id: infoId,
      contactId,
      about: "Updated about",
      contact: {
        address: "2 Oak",
        phone: "5035550199",
        email: "new@example.com",
      },
      hours: hourRows.map((h) =>
        h.day === "tuesday"
          ? { ...h, open: "12:00", close: "23:00" }
          : { ...h, open: h.open, close: h.close }
      ),
    });

    expect(res.ok).toBe(true);
    expect(res.data?.about).toBe("Updated about");
    expect(res.data?.contact.address).toBe("2 Oak");
    const tue = res.data?.hours.find((h: Hours) => h.day === "tuesday");
    expect(tue?.open).toBe("12:00");
    expect(tue?.close).toBe("23:00");
  });

  it("menu: add after seed row, edit, delete", async () => {
    const menuId = "menu-seed-1";
    const priceId = "price-seed-1";

    await testDb.insert(menu).values({
      id: menuId,
      idx: 0,
      name: "Seed",
      description: "",
      course: "appetizer",
      service: "dinner",
      disabled: false,
    });
    await testDb.insert(price).values({
      id: priceId,
      menuId,
      dinner: "9",
      lunch: "",
      hh: "",
      drinks: "",
      dessert: "",
    });

    const addRes = await caller.menu.add({
      items: [
        {
          name: "Added app",
          description: "d",
          course: "appetizer",
          price: {
            lunch: "",
            dinner: "11",
            hh: "",
            drinks: "",
            dessert: "",
          },
        },
      ],
    });
    expect(addRes.ok).toBe(true);
    expect(addRes.data?.length).toBe(1);
    expect(addRes.data?.[0]?.name).toBe("Added app");

    const rows = await testDb.query.menu.findMany({
      where: eq(menu.course, "appetizer"),
      orderBy: [asc(menu.idx)],
      columns: { id: true, idx: true, name: true },
    });
    expect(rows.length).toBe(2);

    const addedId = addRes.data![0]!.id;

    const [addedPrice] = await testDb
      .select({ id: price.id })
      .from(price)
      .where(eq(price.menuId, addedId))
      .limit(1);

    const editRes = await caller.menu.edit([
      {
        id: addedId,
        operation: "update",
        data: {
          name: "Renamed",
          price: {
            id: addedPrice!.id,
            dinner: "15",
          },
        },
      },
    ]);
    expect(editRes.ok).toBe(true);
    const renamed = editRes.data?.menu.find(
      (m: { id: string; name: string; price?: { dinner: string } | null }) =>
        m.id === addedId
    );
    expect(renamed?.name).toBe("Renamed");
    expect(renamed?.price?.dinner).toBe("15");

    const [rowBeforeDel] = await testDb
      .select({ idx: menu.idx })
      .from(menu)
      .where(eq(menu.id, addedId))
      .limit(1);

    const delRes = await caller.menu.delete([
      { id: addedId, idx: rowBeforeDel!.idx },
    ]);
    expect(delRes.ok).toBe(true);

    const afterDel = await testDb.query.menu.findMany({
      columns: { id: true },
    });
    expect(afterDel.some((m) => m.id === addedId)).toBe(false);
  });

  it("menu: add first item to an empty course (idx 0)", async () => {
    const res = await caller.menu.add({
      items: [
        {
          name: "First entree",
          description: "",
          course: "entree",
          price: {
            lunch: "",
            dinner: "22",
            hh: "",
            drinks: "",
            dessert: "",
          },
        },
      ],
    });
    expect(res.ok).toBe(true);

    const [row] = await testDb
      .select({ idx: menu.idx, name: menu.name })
      .from(menu)
      .where(eq(menu.course, "entree"))
      .limit(1);

    expect(row?.idx).toBe(0);
    expect(row?.name).toBe("First entree");
  });

  it("people: create, update, delete (Better Auth user table)", async () => {
    const uniqueEmail = `pat-${crypto.randomUUID()}@example.com`;
    const created = await caller.people.create({
      name: "Pat",
      email: uniqueEmail,
    });
    expect(created.ok).toBe(true);
    const id = created.data!.id;

    const updated = await caller.people.update({
      id,
      name: "Patty",
      email: `patty-${crypto.randomUUID()}@example.com`,
    });
    expect(updated.ok).toBe(true);
    expect(updated.data?.name).toBe("Patty");

    const deleted = await caller.people.delete({ id });
    expect(deleted.ok).toBe(true);
  });
});
