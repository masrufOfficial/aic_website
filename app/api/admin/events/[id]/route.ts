import { NextResponse } from "next/server";

import { ensureAdminApi } from "@/lib/admin";
import { apiError, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await ensureAdminApi();
    if (error) {
      return error;
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
    const { error } = await ensureAdminApi();
    if (error) {
      return error;
    }

    const { id } = await params;
    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return apiError("Unable to delete event.", 400);
  }
}
