import { NextResponse } from "next/server";

import { ensureAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await ensureAdminApi();
  if (error) {
    return error;
  }

  const [users, memberships] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.membership.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({ users, memberships });
}
