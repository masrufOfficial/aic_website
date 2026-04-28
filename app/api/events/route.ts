import { NextResponse } from "next/server";

import { apiError, parseBody } from "@/lib/api";
import { getCurrentApiUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
  });

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentApiUser();
    if (!user || user.role !== "admin") {
      return apiError("Unauthorized.", 401);
    }
    const body = await parseBody(request, eventSchema);

    const event = await prisma.event.create({
      data: {
        ...body,
        date: new Date(body.date),
        registrationLink: body.registrationLink || null,
        coverImage: body.coverImage || null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch {
    return apiError("Unable to create event.", 400);
  }
}
