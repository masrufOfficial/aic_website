import { NextResponse } from "next/server";

import { apiError, parseBody } from "@/lib/api";
import { getCurrentApiUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    return apiError("Event not found.", 404);
  }

  return NextResponse.json(event);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentApiUser();
    if (!user || user.role !== "admin") {
      return apiError("Unauthorized.", 401);
    }
    const { id } = await params;
    const body = await parseBody(request, eventSchema);

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...body,
        date: new Date(body.date),
        registrationLink: body.registrationLink || null,
        coverImage: body.coverImage || null,
      },
    });

    return NextResponse.json(event);
  } catch {
    return apiError("Unable to update event.", 400);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentApiUser();
    if (!user || user.role !== "admin") {
      return apiError("Unauthorized.", 401);
    }
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return apiError("Unable to delete event.", 400);
  }
}
