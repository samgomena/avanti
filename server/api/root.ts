import { infoRouter } from "./routers/info";
import { menuRouter } from "./routers/menu";
import { alertsRouter } from "./routers/alerts";
import { createCallerFactory, createTRPCRouter } from "./trpc";
import { peopleRouter } from "./routers/people";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  info: infoRouter,
  menu: menuRouter,
  alerts: alertsRouter,
  people: peopleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
