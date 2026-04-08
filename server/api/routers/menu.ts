import { validationSchema as addValidationSchema } from "@/pages/admin/menu/add";
import type { Course, Service } from "@/lib/db/schema";
import {
  MENU_COURSE_ORDER_CASE_SQL,
  menu,
  menuCourseDisplayOrder,
  price,
} from "@/lib/db/schema";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, gt, inArray, sql } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure, createTRPCRouter } from "../trpc";

const updateMenuItemSchema = z.array(
  z.object({
    id: z.string(),
    operation: z.enum(["update", "delete"]),
    data: z
      .object({
        idx: z.number().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        service: z.enum(["dinner", "lunch", "hh"]).optional(),
        course: z.enum(["appetizer", "entree", "drink", "dessert"]).optional(),
        disabled: z.boolean().optional(),
        price: z
          .object({
            id: z.string(),
            dinner: z.string().optional(),
            lunch: z.string().optional(),
            hh: z.string().optional(),
            drinks: z.string().optional(),
            dessert: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
  })
);

type MenuBulkRow = {
  id: string;
  idx: number | null;
  name: string | null;
  description: string | null;
  course: string | null;
  disabled: boolean | null;
};

type PriceBulkRow = {
  id: string;
  dinner: string | null;
  lunch: string | null;
  hh: string | null;
  drinks: string | null;
  dessert: string | null;
};

/**
 * One `UPDATE` for all menu rows (SQLite-friendly): `CASE id WHEN … THEN COALESCE(new, col)`.
 * Bound `null` means “leave this column for this row”.
 */
function bulkUpdateMenuCase(rows: MenuBulkRow[]) {
  if (rows.length === 0) {
    return null;
  }

  const idxCase = sql.join(
    [
      sql`CASE id`,
      ...rows.map((r) => sql`WHEN ${r.id} THEN COALESCE(${r.idx}, idx)`),
      sql`ELSE idx END`,
    ],
    sql.raw(" ")
  );

  const nameCase = sql.join(
    [
      sql`CASE id`,
      ...rows.map((r) => sql`WHEN ${r.id} THEN COALESCE(${r.name}, name)`),
      sql`ELSE name END`,
    ],
    sql.raw(" ")
  );

  const descCase = sql.join(
    [
      sql`CASE id`,
      ...rows.map((r) => sql`WHEN ${r.id} THEN COALESCE(${r.description}, description)`),
      sql`ELSE description END`,
    ],
    sql.raw(" ")
  );

  const courseCase = sql.join(
    [
      sql`CASE id`,
      ...rows.map((r) => sql`WHEN ${r.id} THEN COALESCE(${r.course}, course)`),
      sql`ELSE course END`,
    ],
    sql.raw(" ")
  );

  const disabledCase = sql.join(
    [
      sql`CASE id`,
      ...rows.map((r) => {
        const v =
          r.disabled === null || r.disabled === undefined
            ? null
            : r.disabled
              ? 1
              : 0;
        return sql`WHEN ${r.id} THEN COALESCE(${v}, disabled)`;
      }),
      sql`ELSE disabled END`,
    ],
    sql.raw(" ")
  );

  const idIn = sql.join(
    rows.map((r) => sql`${r.id}`),
    sql`, `
  );

  return sql`
    UPDATE "Menu" SET
      idx = ${idxCase},
      name = ${nameCase},
      description = ${descCase},
      course = ${courseCase},
      disabled = ${disabledCase}
    WHERE id IN (${idIn})
  `;
}

function bulkUpdatePriceCase(rows: PriceBulkRow[]) {
  if (rows.length === 0) {
    return null;
  }

  const dinnerCase = sql.join(
    [
      sql`CASE id`,
      ...rows.map((r) => sql`WHEN ${r.id} THEN COALESCE(${r.dinner}, dinner)`),
      sql`ELSE dinner END`,
    ],
    sql.raw(" ")
  );

  const lunchCase = sql.join(
    [
      sql`CASE id`,
      ...rows.map((r) => sql`WHEN ${r.id} THEN COALESCE(${r.lunch}, lunch)`),
      sql`ELSE lunch END`,
    ],
    sql.raw(" ")
  );

  const hhCase = sql.join(
    [
      sql`CASE id`,
      ...rows.map((r) => sql`WHEN ${r.id} THEN COALESCE(${r.hh}, hh)`),
      sql`ELSE hh END`,
    ],
    sql.raw(" ")
  );

  const drinksCase = sql.join(
    [
      sql`CASE id`,
      ...rows.map((r) => sql`WHEN ${r.id} THEN COALESCE(${r.drinks}, drinks)`),
      sql`ELSE drinks END`,
    ],
    sql.raw(" ")
  );

  const dessertCase = sql.join(
    [
      sql`CASE id`,
      ...rows.map((r) => sql`WHEN ${r.id} THEN COALESCE(${r.dessert}, dessert)`),
      sql`ELSE dessert END`,
    ],
    sql.raw(" ")
  );

  const idIn = sql.join(
    rows.map((r) => sql`${r.id}`),
    sql`, `
  );

  return sql`
    UPDATE "Price" SET
      dinner = ${dinnerCase},
      lunch = ${lunchCase},
      hh = ${hhCase},
      drinks = ${drinksCase},
      dessert = ${dessertCase}
    WHERE id IN (${idIn})
  `;
}

/**
 * One pass: compact `idx` to 0…n-1 **globally** in display order: course (app → entree → dessert → drink),
 * then `idx`, then `id`. Matches the admin list and public menu flow.
 */
const reindexMenuGlobalSql = sql.raw(`
  UPDATE "Menu" AS m
  SET idx = v.new_idx
  FROM (
    SELECT id, (ROW_NUMBER() OVER (ORDER BY ${MENU_COURSE_ORDER_CASE_SQL.trim()} ASC, idx ASC, id ASC) - 1) AS new_idx
    FROM "Menu"
  ) AS v
  WHERE m.id = v.id
`);

/**
 * `idx` is **per course**: ordering and shifts only affect rows sharing the same `course`.
 * - `add` appends at `max(idx) + 1` within the course (or `0` if the course is empty).
 * - `delete` decrements `idx` only for rows in that course with `idx` greater than the removed row.
 * - `edit`: bulk `UPDATE "Menu"` / `UPDATE "Price"`, then global `idx` renumber (`ROW_NUMBER` by course display order, `idx`, `id`).
 */
export const menuRouter = createTRPCRouter({
  add: protectedProcedure.input(addValidationSchema).mutation(async (opts) => {
    const { input, ctx } = opts;

    const createdItems: {
      id: string;
      idx: number;
      name: string;
      description: string | null;
      service: Service | null;
      course: Course;
      disabled: boolean;
    }[] = [];

    for (const item of input.items) {
      try {
        await ctx.db.transaction(async (tx) => {
          const [lastIndexRow] = await tx
            .select({ idx: menu.idx })
            .from(menu)
            .where(eq(menu.course, item.course))
            .orderBy(desc(menu.idx))
            .limit(1);

          const nextIdx = lastIndexRow ? lastIndexRow.idx + 1 : 0;

          const menuId = crypto.randomUUID();
          const priceId = crypto.randomUUID();

          await tx.insert(menu).values({
            id: menuId,
            idx: nextIdx,
            name: item.name,
            description: item.description ?? "",
            course: item.course,
            service: "dinner",
            disabled: false,
          });

          await tx.insert(price).values({
            id: priceId,
            menuId,
            dinner: item.price.dinner?.toString() || "0",
            lunch: item.price.lunch?.toString() || "0",
            hh: item.price.hh?.toString() || "0",
            drinks: item.price.drinks?.toString() || "0",
            dessert: item.price.dessert?.toString() || "0",
          });

          const [created] = await tx
            .select({
              id: menu.id,
              idx: menu.idx,
              name: menu.name,
              description: menu.description,
              service: menu.service,
              course: menu.course,
              disabled: menu.disabled,
            })
            .from(menu)
            .where(eq(menu.id, menuId))
            .limit(1);

          if (created) {
            createdItems.push(created);
          }
        });
      } catch (error) {
        if (typeof error === "string") {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error,
          });
        }
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }

    return {
      ok: true,
      data: createdItems,
      error: null,
    };
  }),
  edit: protectedProcedure
    .input(updateMenuItemSchema)
    .mutation(async (opts) => {
      const { input, ctx } = opts;

      try {
        const results = await ctx.db.transaction(async (tx) => {
          const deletions = input
            .filter((i) => i.operation === "delete")
            .map((i) => i.id);

          if (deletions.length > 0) {
            await tx.delete(menu).where(inArray(menu.id, deletions));
          }

          // Two bulk UPDATEs (menu, then price), then reindex — single atomic transaction.
          const menuRows: MenuBulkRow[] = [];

          const priceRows: PriceBulkRow[] = [];

          for (const item of input) {
            if (item.operation !== "update" || !item.data) continue;
            const d = item.data;

            menuRows.push({
              id: item.id,
              idx: d.idx ?? null,
              name: d.name ?? null,
              description: d.description ?? null,
              course: d.course ?? null,
              disabled: d.disabled ?? null,
            });

            if (d.price) {
              priceRows.push({
                id: d.price.id,
                dinner: d.price.dinner ?? null,
                lunch: d.price.lunch ?? null,
                hh: d.price.hh ?? null,
                drinks: d.price.drinks ?? null,
                dessert: d.price.dessert ?? null,
              });
            }
          }

          const menuBulkSql = bulkUpdateMenuCase(menuRows);
          if (menuBulkSql) {
            await tx.run(menuBulkSql);
          }

          const priceBulkSql = bulkUpdatePriceCase(priceRows);
          if (priceBulkSql) {
            await tx.run(priceBulkSql);
          }

          await tx.run(reindexMenuGlobalSql);

          const menuList = await tx.query.menu.findMany({
            orderBy: [asc(menuCourseDisplayOrder), asc(menu.idx)],
            columns: {
              id: true,
              idx: true,
              name: true,
              description: true,
              course: true,
              disabled: true,
            },
            with: {
              price: {
                columns: {
                  id: true,
                  lunch: true,
                  dinner: true,
                  drinks: true,
                  dessert: true,
                },
              },
            },
          });

          return { menu: menuList };
        });

        return {
          ok: true,
          data: results,
          error: null,
        };
      } catch (error) {
        if (typeof error === "string") {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error,
          });
        }
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  // `idx` in the payload is legacy; we load `course` + `idx` from the DB for same-course shifts.
  delete: protectedProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          idx: z.number(),
        })
      )
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;

      type Errors = { ok: false; data: null; error: string }[];
      const errors: Errors = [];

      for (const item of input) {
        try {
          await ctx.db.transaction(async (tx) => {
            const [row] = await tx
              .select({ course: menu.course, idx: menu.idx })
              .from(menu)
              .where(eq(menu.id, item.id))
              .limit(1);

            if (!row) {
              throw new Error("Menu item not found");
            }

            await tx
              .update(menu)
              .set({ idx: sql`${menu.idx} - 1` })
              .where(
                and(eq(menu.course, row.course), gt(menu.idx, row.idx))
              );

            await tx.delete(menu).where(eq(menu.id, item.id));
          });
        } catch (error) {
          errors.push({
            ok: false,
            data: null,
            error: typeof error === "string" ? error : (error as Error).message,
          });
        }
      }

      if (errors.length !== 0) {
        return {
          ok: false,
          data: null,
          error: errors,
        };
      }

      return {
        ok: true,
        data: [],
        error: null,
      };
    }),
});
