import { NextResponse } from "next/server";

import { apiError } from "@/lib/api";
import { getCurrentApiUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentApiUser();
    if (!user) {
      return apiError("Unauthorized.", 401);
    }
    const { id } = await params;

    const registration = await prisma.eventRegistration.create({
      data: {
        userId: user.id,
        eventId: id,
      },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        label: "Registered for an event",
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch {
    return apiError("Unable to register for this event.", 400);
  }
}
