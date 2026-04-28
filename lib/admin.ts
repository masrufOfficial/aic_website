import { getCurrentApiUser, requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/api";

export async function requireAdminPage() {
  return requireAdmin();
}

export async function ensureAdminApi() {
  const user = await getCurrentApiUser();
  if (!user) {
    return {
      user: null,
      error: apiError("Unauthorized.", 401),
    };
  }

  if (user.role !== "admin") {
    return {
      user: null,
      error: apiError("Forbidden.", 403),
    };
  }

  return {
    user,
    error: null,
  };
}
