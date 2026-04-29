import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) {
        return true;
      }

      await prisma.user.upsert({
        where: { email: user.email.toLowerCase() },
        update: {
          name: user.name ?? user.email.split("@")[0],
          image: user.image ?? undefined,
          profileImage: user.image ?? undefined,
          emailVerified: true,
        },
        create: {
          name: user.name ?? user.email.split("@")[0],
          email: user.email.toLowerCase(),
          role: "user",
          image: user.image ?? null,
          profileImage: user.image ?? null,
          emailVerified: true,
          membershipStatus: "inactive",
        },
      });

      return true;
    },
    async jwt({ token, user }) {
      const lookupEmail = user?.email || token.email;

      if (lookupEmail) {
        const dbUser = await prisma.user.findUnique({
          where: { email: lookupEmail.toLowerCase() },
        });

        if (dbUser) {
          token.userId = dbUser.id;
          token.role = dbUser.role;
          token.membershipStatus = dbUser.membershipStatus;
          token.image = dbUser.image ?? dbUser.profileImage ?? null;
          token.emailVerified = dbUser.emailVerified;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? "");
        session.user.role = String(token.role ?? "user");
        session.user.membershipStatus = String(token.membershipStatus ?? "inactive");
        session.user.emailVerified = Boolean(token.emailVerified);
        session.user.image = (token.image as string | null | undefined) ?? session.user.image;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export function getAuthSession() {
  return getServerSession(authOptions);
}
