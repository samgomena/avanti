import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { sqliteSchema } from "./schema";

function libsqlUrl(): string {
  return (
    process.env.LIBSQL_URL ??
    process.env.TURSO_DATABASE_URL ??
    "file:./data/local.db"
  );
}

function libsqlAuthToken(): string | undefined {
  return process.env.LIBSQL_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN;
}

const globalForLibsql = globalThis as unknown as {
  libsqlClient?: Client;
};

function createLibsqlClient(): Client {
  const url = libsqlUrl();
  const authToken = libsqlAuthToken();
  return createClient({
    url,
    ...(authToken ? { authToken } : {}),
  });
}

const libsqlClient = globalForLibsql.libsqlClient ?? createLibsqlClient();
if (process.env.NODE_ENV !== "production") {
  globalForLibsql.libsqlClient = libsqlClient;
}

export { libsqlClient };

/** Drizzle over libSQL (Turso or local file). */
export const drizzleDb = drizzle(libsqlClient, { schema: sqliteSchema });

export type AppDrizzleDatabase = typeof drizzleDb;
