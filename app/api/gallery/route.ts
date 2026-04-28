import { NextResponse } from "next/server";

import { apiError, parseBody } from "@/lib/api";
import { getCurrentApiUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gallerySchema } from "@/lib/validators";

export async function GET() {
  const items = await prisma.gallery.findMany({
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentApiUser();
    if (!user || user.role !== "admin") {
      return apiError("Unauthorized.", 401);
    }
    const body = await parseBody(request, gallerySchema);
    const item = await prisma.gallery.create({ data: body });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return apiError("Unable to add gallery image.", 400);
  }
}
