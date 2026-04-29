import { MembershipStatus } from "@prisma/client";

export function isVerifiedMember(user: { emailVerified: boolean; membershipStatus: MembershipStatus } | null | undefined) {
  return Boolean(user?.emailVerified && user.membershipStatus === "active");
}
