import { NextResponse } from "next/server";

import { ensureAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await ensureAdminApi();
  if (error) {
    return error;
  }

  const applications = await prisma.executiveApplication.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(applications);
}
