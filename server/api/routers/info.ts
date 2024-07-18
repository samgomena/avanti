import { validationSchema } from "@/pages/admin/info/edit";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, createTRPCRouter } from "../trpc";

export const infoRouter = createTRPCRouter({
	update: protectedProcedure.input(validationSchema).mutation(async (opts) => {
		const { input, ctx } = opts;

		try {
			const updates = await ctx.db.$transaction([
				ctx.db.info.update({
					where: { id: input.id },
					data: {
						about: input.about,
						// Update contact info
						contact: {
							update: input.contact,
							connect: { id: input.contactId },
						},
					},
					include: {
						contact: true,
					},
				}),
				...input.hours.map((hour) =>
					ctx.db.hours.update({
						where: { id: hour.id },
						// Note: we only allow updating openinig/closing times
						data: { open: hour.open, close: hour.close },
					}),
				),
			]);

			// "massage" updated data into the format we want (i.e. the shape of the request)
			const [info, ...hours] = updates ?? [];
			const updatedInfo = {
				...info,
				hours,
			};

			return {
				ok: true,
				data: updatedInfo,
				error: null,
			};
		} catch (error) {
			if (typeof error === "string") {
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error });
			}
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
		}
	}),
});
