import { APIError } from "better-call";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";

import { drizzleDb } from "./db/libsql";
import { user } from "./db/schema";

function createMailer() {
  const host = process.env.EMAIL_SERVER_HOST;
  const port = Number(process.env.EMAIL_SERVER_PORT);
  if (!host || Number.isNaN(port)) {
    throw new Error("EMAIL_SERVER_HOST and EMAIL_SERVER_PORT are required for magic links");
  }
  const userEnv = process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD;
  return nodemailer.createTransport({
    host,
    port,
    ...(userEnv || pass
      ? {
          auth: {
            user: userEnv ?? "",
            pass: pass ?? "",
          },
        }
      : {}),
  });
}

/**
 * Better Auth (libSQL / Turso). Magic link email matches former NextAuth `EmailProvider` env vars.
 */
export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ??
    "dev-only-secret-replace-with-BETTER_AUTH_SECRET-32chars-min",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  basePath: "/api/auth",
  database: drizzleAdapter(drizzleDb, {
    provider: "sqlite",
  }),
  plugins: [
    magicLink({
      disableSignUp: true,
      async sendMagicLink({ email: to, url }) {
        const [existing] = await drizzleDb
          .select({ id: user.id })
          .from(user)
          .where(eq(user.email, to))
          .limit(1);

        if (!existing) {
          throw new APIError("FORBIDDEN", {
            message: "Sign in failed.",
          });
        }

        const from = process.env.EMAIL_FROM;
        if (!from) {
          throw new Error("EMAIL_FROM is required to send magic links");
        }

        const transport = createMailer();
        await transport.sendMail({
          from,
          to,
          subject: "Sign in to Avanti",
          text: `Sign in: ${url}`,
          html: `<p><a href="${url}">Sign in to Avanti</a></p>`,
        });
      },
    }),
  ],
});
