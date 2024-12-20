import { validationSchema as addValidationSchema } from "@/pages/admin/menu/add";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, createTRPCRouter } from "../trpc";
import { type Courses, Services } from "@prisma/client";
import { z } from "zod";

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

export const menuRouter = createTRPCRouter({
  add: protectedProcedure.input(addValidationSchema).mutation(async (opts) => {
    const { input, ctx } = opts;

    type Errors = { ok: false; data: null; error: string }[];
    const errors: Errors = [];

    // This type was taken directly from the prisma `.create(...)` method below.
    // It may need to be updated in the future.
    const createdItems: {
      id: string;
      idx: number;
      name: string;
      description: string | null;
      service: Services | null;
      course: Courses;
      disabled: boolean;
    }[] = [];

    for (const item of input.items) {
      try {
        await ctx.db.$transaction(async (tx) => {
          if ((await tx.menu.count()) === 0) {
          }

          const lastIndex = await tx.menu.findFirst({
            where: {
              course: {
                equals: item.course,
              },
            },
            orderBy: {
              idx: "desc",
            },
            select: {
              idx: true,
            },
          });

          if (!lastIndex) {
            // TODO: Currently don't support adding new items to a fresh db, but this enables it.
            // TODO: Not sure if it's good to have or nah
            // lastIndex = { idx: 0 };

            errors.push({
              ok: false,
              data: null,
              error: `Couldn't find index to insert '${item.name}' at`,
            });
            throw new Error(`Couldn't find index to insert '${item.name}' at`);
          }

          // Add one to every index *after* the index we're inserting at
          const _ = await tx.menu.updateMany({
            where: {
              idx: {
                gt: lastIndex.idx,
              },
            },
            data: {
              idx: {
                increment: 1,
              },
            },
          });

          // And then insert the new item at the index we found
          const created = await tx.menu.create({
            data: {
              idx: lastIndex ? lastIndex.idx + 1 : 0,
              name: item.name,
              description: item.description,
              course: item.course,
              service: Services.dinner,
              disabled: false,
              price: {
                create: {
                  dinner: item.price.dinner?.toString() || "0",
                  lunch: item.price.lunch?.toString() || "0",
                  hh: item.price.hh?.toString() || "0",
                  drinks: item.price.drinks?.toString() || "0",
                  dessert: item.price.dessert?.toString() || "0",
                },
              },
            },
          });
          createdItems.push(created);
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
        const results = await ctx.db.$transaction(
          async (tx) => {
            const deletedIds: string[] = [];
            const updatedItems: object[] = [];

            // Process deletions
            for (const item of input) {
              if (item.operation === "delete") {
                await tx.menu.delete({ where: { id: item.id } });
                deletedIds.push(item.id);
              }
            }

            // TODO: Process additions
            // for (const item of input.filter((i) => i.operation === "add")) {
            //   // Shift existing items to make space
            //   await tx.menu.updateMany({
            //     where: { idx: { gte: item.data.idx } },
            //     data: { idx: { increment: 1 } },
            //   });

            //   const newItem = await tx.menu.create({
            //     data: {
            //       ...item.data,
            //       price: item.data.price ? { create: item.data.price } : undefined,
            //     },
            //     include: { price: true },
            //   });
            //   addedItems.push(newItem);
            // }

            // Process updates
            for (const item of input) {
              if (item.operation === "update" && item.data) {
                const updatedMenu = await tx.menu.update({
                  where: { id: item.id },
                  data: {
                    idx: item.data.idx,
                    name: item.data.name,
                    description: item.data.description,
                    service: item.data.service,
                    course: item.data.course,
                    disabled: item.data.disabled,
                    price: item.data.price
                      ? {
                          update: item.data.price,
                        }
                      : undefined,
                  },
                  include: { price: true },
                });
                updatedItems.push(updatedMenu);
              }
            }

            // Reorder remaining items
            const allItems = await tx.menu.findMany({
              orderBy: { idx: "asc" },
            });

            await Promise.all(
              allItems.map(({ id }, idx) =>
                tx.menu.update({
                  where: { id },
                  data: { idx },
                })
              )
            );
            // Fetch entire menu as our last order of business because the frontend is stoopid and can't
            // selectively update the form with partial data
            const menu = await tx.menu.findMany({
              orderBy: [
                {
                  course: "asc",
                },
                { idx: "asc" },
              ],
              select: {
                id: true,
                idx: true,
                name: true,
                description: true,
                course: true,
                disabled: true,
                price: {
                  select: {
                    id: true,
                    lunch: true,
                    dinner: true,
                    drinks: true,
                    dessert: true,
                  },
                },
              },
            });

            return {
              // deletedIds,
              // updatedItems,
              menu,
            };
          },
          // TODO: This is really, really slow and we will eventually need to fix it.
          // The biggest issue is that we have to perform every update one by one. Prisma doesn't support batch updates natively.
          // See:
          // - https://github.com/prisma/prisma/discussions/19765
          // - https://gist.github.com/aalin/ea23b786e3d55329f6257c0f6576418b
          // Or, alternatively use raw SQL but upgrade to v6 so it's typed and safe
          // - https://www.prisma.io/blog/prisma-6-better-performance-more-flexibility-and-type-safe-sql#typed-sql-type-safe-raw-sql-queries
          { timeout: 60_000 }
        );
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
          await ctx.db.$transaction(async (tx) => {
            // Remove one from every index *after* the index we're removing from
            const _ = await tx.menu.updateMany({
              where: {
                idx: {
                  gt: item.idx,
                },
              },
              data: {
                idx: {
                  decrement: 1,
                },
              },
            });

            const deleted = await tx.menu.delete({
              where: {
                id: item.id,
              },
            });
          });
        } catch (error) {
          errors.push({
            ok: false,
            data: null,
            // @ts-expect-error: TODO: You should probably narrow down the type of errors that can pop up here
            error: typeof error === "string" ? error : error.message,
          });
        }
      }

      if (errors.length !== 0) {
        // if (typeof error === "string") {
        //   throw new TRPCError({
        //     code: "INTERNAL_SERVER_ERROR",
        //     message: error,
        //   });
        // } else {
        //   throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        // }
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
