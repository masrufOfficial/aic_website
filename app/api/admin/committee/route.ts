import { NextResponse } from "next/server";

import { ensureAdminApi } from "@/lib/admin";
import { apiError, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { committeeSchema } from "@/lib/validators";

export async function GET() {
  const { error } = await ensureAdminApi();
  if (error) {
    return error;
  }

  const committee = await prisma.committee.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(committee);
}

export async function POST(request: Request) {
  try {
    const { error } = await ensureAdminApi();
    if (error) {
      return error;
    }

    const body = await parseBody(request, committeeSchema);
    const member = await prisma.committee.create({
      data: {
        ...body,
        group: body.group ?? (body.isAlumni ? "alumni" : "executive"),
        userId: body.userId || null,
        isAlumni: body.isAlumni ?? false,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch {
    return apiError("Unable to create committee member.", 400);
  }
}
