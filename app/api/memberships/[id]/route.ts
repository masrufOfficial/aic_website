import { NextResponse } from "next/server";
import { z } from "zod";

import { ensureAdminApi } from "@/lib/admin";
import { apiError, handleApiError, parseBody } from "@/lib/api";
import { approveMembershipRequest, expireMemberships, rejectMembershipRequest } from "@/lib/membership";
import { prisma } from "@/lib/prisma";
import { enforceMutationSecurity } from "@/lib/security";

const updateMembershipSchema = z.object({
  status: z.enum(["active", "rejected"]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const securityError = enforceMutationSecurity(request, {
      rateLimitKey: "membership-review",
      limit: 20,
      windowMs: 60_000,
    });
    if (securityError) {
      return securityError;
    }

    await expireMemberships();

    const { error } = await ensureAdminApi();
    if (error) {
      return error;
    }

    const { id } = await params;
    const body = await parseBody(request, updateMembershipSchema);

    const membership =
      body.status === "active"
        ? await approveMembershipRequest(id)
        : await rejectMembershipRequest(id);

    await prisma.activity.create({
      data: {
        userId: membership.userId,
        label: `Membership ${body.status}`,
      },
    });

    return NextResponse.json(membership, { status: 200 });
  } catch (error) {
    return handleApiError(error, "Unable to update membership.", 400);
  }
}
