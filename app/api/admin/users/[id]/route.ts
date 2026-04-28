import { NextResponse } from "next/server";
import { z } from "zod";

import { ensureAdminApi } from "@/lib/admin";
import { apiError, handleApiError, parseBody } from "@/lib/api";
import { approveMembershipRequest, rejectMembershipRequest } from "@/lib/membership";
import { prisma } from "@/lib/prisma";
import { updateUserSchema } from "@/lib/validators";

const membershipReviewSchema = z.object({
  membershipRequestId: z.string().min(1),
  status: z.enum(["active", "rejected", "pending", "inactive", "expired"]),
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await ensureAdminApi();
    if (error) {
      return error;
    }

    const { id } = await params;
    const body = await parseBody(request, updateUserSchema);
    const user = await prisma.user.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error, "Unable to update user.", 400);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await ensureAdminApi();
    if (error) {
      return error;
    }

    const { id } = await params;
    const body = await parseBody(request, membershipReviewSchema);

    if (body.status === "pending" || body.status === "inactive" || body.status === "expired") {
      const user = await prisma.user.update({
        where: { id },
        data: { membershipStatus: body.status },
      });

      return NextResponse.json(user);
    }

    const membership =
      body.status === "active"
        ? await approveMembershipRequest(body.membershipRequestId)
        : await rejectMembershipRequest(body.membershipRequestId);

    await prisma.activity.create({
      data: {
        userId: id,
        label: `Membership ${body.status}`,
      },
    });

    return NextResponse.json(membership);
  } catch (error) {
    return handleApiError(error, "Unable to update membership.", 400);
  }
}
