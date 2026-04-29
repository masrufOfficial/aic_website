import { Membership, MembershipStatus, Prisma, User } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type MembershipRecord = Membership & {
  user?: User;
};

export function addOneYear(date: Date) {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + 1);
  return next;
}

export function getMembershipBadgeVariant(status: MembershipStatus) {
  switch (status) {
    case "active":
      return "success" as const;
    case "pending":
      return "warning" as const;
    case "expired":
    case "rejected":
      return "danger" as const;
    case "inactive":
    default:
      return "default" as const;
  }
}

export async function expireMemberships() {
  const now = new Date();

  const expiredMemberships = await prisma.membership.findMany({
    where: {
      status: "active",
      expiresAt: {
        lt: now,
      },
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (expiredMemberships.length === 0) {
    return;
  }

  const userIds = Array.from(new Set(expiredMemberships.map((item) => item.userId)));

  await prisma.$transaction([
    prisma.membership.updateMany({
      where: {
        id: {
          in: expiredMemberships.map((item) => item.id),
        },
      },
      data: {
        status: "expired",
      },
    }),
    prisma.user.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data: {
        membershipStatus: "expired",
        membershipExpiry: now,
      },
    }),
  ]);
}

export async function syncUserMembershipState(userId: string) {
  await expireMemberships();

  const latestMembership = await prisma.membership.findFirst({
    where: { userId },
    orderBy: [
      { createdAt: "desc" },
      { updatedAt: "desc" },
    ],
  });

  const nextStatus: MembershipStatus = latestMembership?.status ?? "inactive";

  await prisma.user.update({
    where: { id: userId },
    data: {
      membershipStatus: nextStatus,
      membershipExpiry: latestMembership?.expiresAt ?? null,
    },
  });

  return latestMembership;
}

export async function approveMembershipRequest(membershipId: string) {
  const approvedAt = new Date();
  const expiresAt = addOneYear(approvedAt);

  const membership = await prisma.membership.update({
    where: { id: membershipId },
    data: {
      status: "active",
      approvedAt,
      expiresAt,
    },
    include: {
      user: true,
    },
  });

  await prisma.user.update({
    where: { id: membership.userId },
    data: {
      membershipStatus: "active",
      membershipExpiry: expiresAt,
    },
  });

  return membership;
}

export async function rejectMembershipRequest(membershipId: string) {
  const membership = await prisma.membership.update({
    where: { id: membershipId },
    data: {
      status: "rejected",
      approvedAt: null,
      expiresAt: null,
    },
    include: {
      user: true,
    },
  });

  await prisma.user.update({
    where: { id: membership.userId },
    data: {
      membershipStatus: "rejected",
      membershipExpiry: null,
    },
  });

  return membership;
}

export function getLatestMembership<T extends { memberships: Membership[] }>(user: T) {
  return user.memberships[0] ?? null;
}

export type UserWithMemberships = Prisma.UserGetPayload<{
  include: {
    memberships: true;
  };
}>;
