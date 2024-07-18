import { db } from "@/server/db";
import { validationSchema as addValidationSchema } from "@/pages/admin/menu/add";
// import { validationSchema as editValidationSchema } from "@/pages/admin/menu/edit";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, createTRPCRouter } from "../trpc";
import { Courses, Services } from "@prisma/client";
import { z } from "zod";

// This is copied directly from pages/admin/menu/edit but edited to make the fields optional.
// This is because over there we use the schema to validate the form but only send deltas to
// the backend here, which breaks the schema validation
const editValidationSchema = z.object({
	items: z
		.array(
			z.object({
				name: z.string().optional(),
				description: z.string().optional(),
				course: z.nativeEnum(Courses).optional(),
				price: z
					.object({
						lunch: z.string().optional(),
						dinner: z.string().optional(),
						hh: z.string().optional(),
						dessert: z.string().optional(),
						drinks: z.string().optional(),
						id: z.string(),
					})
					.optional(),
				disabled: z.boolean().optional(),
				// These are the only two fields that are required
				id: z.string(),
				idx: z.number(),
			}),
		)
		// Use `superRefine` here to handle special cases for prices on different courses
		// specifically, we care about enforcing a price on either lunch or dinner for appetizers and entrees
		.superRefine((data, ctx) => {
			data.forEach((item, idx) => {
				if (!item.price) return;
				switch (item.course) {
					case "appetizer":
					case "entree":
						if (!item.price.lunch && !item.price.dinner) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: "A price is required for either lunch or dinner",
								path: [idx, "price", "lunch"],
							});
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: "A price is required for either lunch or dinner",
								path: [idx, "price", "dinner"],
							});
						}
						break;
					case "dessert":
						if (!item.price.dessert) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: "A price is required for this course",
								path: [idx, "price", "dessert"],
							});
						}
						break;
					case "drink":
						if (!item.price.drinks) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: "A price is required for this course",
								path: [idx, "price", "drinks"],
							});
						}
						break;
				}
			});
		}),
});

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
		.input(editValidationSchema)
		.mutation(async (opts) => {
			const { input, ctx } = opts;

			try {
				const menu = await ctx.db.$transaction([
					...input.items.map((item) =>
						ctx.db.menu.update({
							include: {
								price: true,
							},
							where: { id: item.id },
							data: {
								...item,
								price: {
									update: {
										dinner: item.price?.dinner?.toString(),
										lunch: item.price?.lunch?.toString(),
										hh: item.price?.hh?.toString(),
										drinks: item.price?.drinks?.toString(),
										dessert: item.price?.dessert?.toString(),
									},
								},
							},
						}),
					),
					// TODO: I don't think we actually need this?
					// Reorder all the records idx from 0 - n
					// ctx.db.$executeRaw`
					//   WITH ranked_menu AS (
					//     SELECT id, ROW_NUMBER() OVER (ORDER BY course ASC) - 1 AS new_idx
					//     FROM "Menu"
					//   )
					//   UPDATE "Menu"
					//   SET idx = ranked_menu.new_idx
					//   FROM ranked_menu
					//   WHERE "Menu".id = ranked_menu.id
					// `,
					// Fetch entire menu as our last order of business because the frontend is stoopid and can't
					// selectively update the form with partial data
					ctx.db.menu.findMany({
						orderBy: [
							{ idx: "asc" },
							{
								course: "asc",
							},
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
					}),
				]);

				return {
					ok: true,
					// $transaction returns an array of the results of each query, so we want
					// the last item which *should be* the updated menu. The frontend is also
					// stupid in that it doesn't handle the case where the last query here fails.
					data: menu?.at(-1),
					error: null,
				};
			} catch (error) {
				if (typeof error === "string") {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: error,
					});
				}
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
			}
		}),
	delete: protectedProcedure
		.input(
			z.array(
				z.object({
					id: z.string(),
					idx: z.number(),
				}),
			),
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
