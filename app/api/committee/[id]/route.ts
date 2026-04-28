import { NextResponse } from "next/server";

import { apiError } from "@/lib/api";
import { getCurrentApiUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentApiUser();
    if (!user || user.role !== "admin") {
      return apiError("Unauthorized.", 401);
    }
    const { id } = await params;
    await prisma.committee.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return apiError("Unable to delete committee member.", 400);
  }
}
