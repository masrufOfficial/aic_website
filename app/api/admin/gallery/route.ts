import { NextResponse } from "next/server";

import { ensureAdminApi } from "@/lib/admin";
import { apiError, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { gallerySchema } from "@/lib/validators";

export async function GET() {
  const { error } = await ensureAdminApi();
  if (error) {
    return error;
  }

  const gallery = await prisma.gallery.findMany({
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(gallery);
}

export async function POST(request: Request) {
  try {
    const { error } = await ensureAdminApi();
    if (error) {
      return error;
    }

    const body = await parseBody(request, gallerySchema);
    const image = await prisma.gallery.create({
      data: body,
    });

    return NextResponse.json(image, { status: 201 });
  } catch {
    return apiError("Unable to add gallery image.", 400);
  }
}
