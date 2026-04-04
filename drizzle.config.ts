import { defineConfig } from "drizzle-kit";

const url =
  process.env.LIBSQL_URL ??
  process.env.TURSO_DATABASE_URL ??
  "file:./data/local.db";

const authToken =
  process.env.LIBSQL_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN;

export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./drizzle/migrations",
  dialect: "turso",
  dbCredentials: {
    url,
    ...(authToken ? { authToken } : {}),
  },
});
