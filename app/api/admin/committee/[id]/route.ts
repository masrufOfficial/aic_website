import { NextResponse } from "next/server";

import { ensureAdminApi } from "@/lib/admin";
import { apiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await ensureAdminApi();
    if (error) {
      return error;
    }

    const { id } = await params;
    await prisma.committee.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return apiError("Unable to delete committee member.", 400);
  }
}
