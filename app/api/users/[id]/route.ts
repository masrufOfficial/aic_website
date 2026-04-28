import { NextResponse } from "next/server";

import { apiError, parseBody } from "@/lib/api";
import { getCurrentApiUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateUserSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionUser = await getCurrentApiUser();
    if (!sessionUser || sessionUser.role !== "admin") {
      return apiError("Unauthorized.", 401);
    }
    const { id } = await params;
    const body = await parseBody(request, updateUserSchema);
    const updatedUser = await prisma.user.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updatedUser);
  } catch {
    return apiError("Unable to update user.", 400);
  }
}
