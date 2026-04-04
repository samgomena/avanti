import { fromNodeHeaders } from "better-auth/node";
import type { GetServerSidePropsContext } from "next";
import type { IncomingHttpHeaders } from "node:http";

import { auth } from "./auth";

export async function getAuthSessionFromHeaders(headers: IncomingHttpHeaders) {
  return auth.api.getSession({
    headers: fromNodeHeaders(headers),
  });
}

export async function getAuthSessionFromGssp(ctx: GetServerSidePropsContext) {
  return getAuthSessionFromHeaders(ctx.req.headers);
}
