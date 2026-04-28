import { NextResponse } from "next/server";

import { apiError, parseBody } from "@/lib/api";
import { getCurrentApiUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { committeeSchema } from "@/lib/validators";

export async function GET() {
  const members = await prisma.committee.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(members);
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentApiUser();
    if (!user || user.role !== "admin") {
      return apiError("Unauthorized.", 401);
    }
    const body = await parseBody(request, committeeSchema);
    const member = await prisma.committee.create({
      data: {
        ...body,
        isAlumni: body.isAlumni ?? false,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch {
    return apiError("Unable to create committee member.", 400);
  }
}
