import { NextResponse } from "next/server";

import { ensureAdminApi } from "@/lib/admin";
import { apiError, parseBody } from "@/lib/api";
import { sendNewEventEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";

export async function GET() {
  const { error } = await ensureAdminApi();
  if (error) {
    return error;
  }

  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
  });

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  try {
    const { error } = await ensureAdminApi();
    if (error) {
      return error;
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

    const recipients = await prisma.user.findMany({
      where: {
        emailVerified: true,
      },
      select: {
        email: true,
        name: true,
      },
    });

    void Promise.allSettled(
      recipients.map((recipient) =>
        sendNewEventEmail({
          email: recipient.email,
          name: recipient.name,
          eventTitle: event.title,
          eventDate: event.date,
          eventLocation: event.location,
          eventDescription: event.description,
        })
      )
    );

    return NextResponse.json(event, { status: 201 });
  } catch {
    return apiError("Unable to create event.", 400);
  }
}
