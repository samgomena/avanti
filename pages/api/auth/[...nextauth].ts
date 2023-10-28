import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import prisma from "../../../lib/prismadb";

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async signIn({ user, email }) {
      // verificationRequest is true if user is trying to sign in (vs clicking a magig link in their email)
      if (email?.verificationRequest) {
        const userByEmail = await prisma.user.findUnique({
          where: {
            email: user.email!,
          },
        });
        // If they don't exist return false (returning an error to the client and rejecting auth)
        return userByEmail !== null;
      }
      return true;
    },
  },
};

export default NextAuth(authConfig);
