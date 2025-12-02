import { createTRPCRouter, protectedProcedure } from "../trpc";

// import { Vercel } from "@vercel/sdk";

// const vercel = new Vercel({
//   bearerToken: process.env.VERCEL_TOKEN,
// });

// export const deploymentsRouter = createTRPCRouter({
//   get: protectedProcedure.query(async ({ ctx }) => {
//     const deployments = await ctx.db.deployment.findMany();
//     vercel.deployments.getDeployments;
//     return deployments;
//   }),

//   post: protectedProcedure.mutation(async ({ ctx }) => {
//     const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
//     if (!deployHookUrl) {
//       return;
//     }
//     const response = await fetch(deployHookUrl, { method: "POST" });
//     // https://api.vercel.com/v1/integrations/deploy/${process.env.TOKEN // or whatever}
//   }),
// });
