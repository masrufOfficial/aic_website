import { NextResponse } from "next/server";

import { apiError, handleApiError, parseBody } from "@/lib/api";
import { getCurrentApiUser } from "@/lib/auth";
import { expireMemberships } from "@/lib/membership";
import { prisma } from "@/lib/prisma";
import { enforceMutationSecurity, sanitizePlainText } from "@/lib/security";
import { membershipSchema } from "@/lib/validators";

export async function GET() {
  await expireMemberships();

  const user = await getCurrentApiUser();
  if (!user || user.role !== "admin") {
    return apiError("Forbidden.", 403);
  }

  const memberships = await prisma.membership.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(memberships);
}

export async function POST(request: Request) {
  try {
    const securityError = enforceMutationSecurity(request, {
      rateLimitKey: "membership-submit",
      limit: 6,
      windowMs: 60_000,
    });
    if (securityError) {
      return securityError;
    }

    const user = await getCurrentApiUser();
    if (!user) {
      return apiError("Unauthorized.", 401);
    }
    const body = await parseBody(request, membershipSchema);

    const latestMembership = await prisma.membership.findFirst({
      where: { userId: user.id },
      orderBy: [{ createdAt: "desc" }],
    });

    if (latestMembership?.status === "pending") {
      return apiError("You already have a pending membership application.", 409);
    }

    if (latestMembership?.status === "active" && latestMembership.expiresAt && latestMembership.expiresAt > new Date()) {
      return apiError("Your membership is already active.", 409);
    }

    const membership = await prisma.membership.create({
      data: {
        userId: user.id,
        fullName: sanitizePlainText(body.fullName),
        email: body.email.trim().toLowerCase(),
        phone: sanitizePlainText(body.phone),
        membershipId: sanitizePlainText(body.membershipId),
        status: "pending",
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { membershipStatus: "pending" },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        label: "Submitted membership application",
      },
    });

    return NextResponse.json(membership, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Unable to submit membership application.", 400);
  }
}
