import bcrypt from "bcryptjs";
import { MembershipStatus, UserRole } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/auth";
import { syncUserMembershipState } from "@/lib/membership";
import { prisma } from "@/lib/prisma";
import { SessionPayload, signSessionToken, verifySessionToken } from "@/lib/session";

export const SESSION_COOKIE = "bubt_ai_session";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signAuthToken(payload: SessionPayload) {
  return signSessionToken(payload);
}

export async function verifyAuthToken(token: string) {
  return verifySessionToken(token);
}

export async function setSessionCookie(payload: SessionPayload) {
  const cookieStore = await cookies();
  const token = await signAuthToken(payload);

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    priority: "high",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    return verifyAuthToken(token);
  }

  const session = await getAuthSession();
  if (!session?.user?.id || !session.user.email || !session.user.name) {
    return null;
  }

  return {
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: (session.user.role as UserRole) ?? "user",
    membershipStatus: (session.user.membershipStatus as MembershipStatus) ?? "inactive",
  };
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  await syncUserMembershipState(session.userId);

  return prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      memberships: {
        orderBy: {
          createdAt: "desc",
        },
      },
      registrations: {
        include: {
          event: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      activities: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });
}

export async function getCurrentApiUser() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  await syncUserMembershipState(session.userId);

  return prisma.user.findUnique({
    where: { id: session.userId },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") {
    redirect("/login?redirect=/admin");
  }

  return user;
}
