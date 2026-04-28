import { NextResponse } from "next/server";

import { ensureAdminApi } from "@/lib/admin";
import { apiError, parseBody } from "@/lib/api";
import { getContentMap, upsertContentMap } from "@/lib/content";
import { contentUpdateSchema } from "@/lib/validators";

export async function GET() {
  const { error } = await ensureAdminApi();
  if (error) {
    return error;
  }

  const content = await getContentMap();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  try {
    const { error } = await ensureAdminApi();
    if (error) {
      return error;
    }

    const body = await parseBody(request, contentUpdateSchema);
    await upsertContentMap(body);

    return NextResponse.json({ success: true });
  } catch {
    return apiError("Unable to update website content.", 400);
  }
}
