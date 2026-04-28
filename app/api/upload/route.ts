import { NextResponse } from "next/server";

import { getCurrentApiUser } from "@/lib/auth";
import { enforceMutationSecurity } from "@/lib/security";
import { saveUploadedFile } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const securityError = enforceMutationSecurity(request, {
      rateLimitKey: "file-upload",
      limit: 20,
      windowMs: 60_000,
    });
    if (securityError) {
      return securityError;
    }

    const user = await getCurrentApiUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const isAdmin = user.role === "admin";
    const formData = await request.formData();
    const folder = String(formData.get("folder") ?? "general");
    const entries = formData.getAll("files");
    const safeFolder = folder.replace(/[^a-z0-9-_]/gi, "").toLowerCase() || "general";

    if (!isAdmin && !["research", "profiles"].includes(safeFolder)) {
      return NextResponse.json({ error: "You can only upload research or profile files." }, { status: 403 });
    }

    if (entries.length === 0) {
      return NextResponse.json({ error: "No files were uploaded." }, { status: 400 });
    }

    const uploads = await Promise.all(
      entries.map(async (entry) => {
        if (!(entry instanceof File)) {
          throw new Error("Invalid file payload.");
        }

        if (safeFolder === "profiles" && !entry.type.startsWith("image/")) {
          throw new Error("Profile uploads must be images.");
        }

        const url = await saveUploadedFile(entry, safeFolder);
        return {
          url,
          name: entry.name,
          size: entry.size,
          type: entry.type,
        };
      })
    );

    return NextResponse.json({
      files: uploads,
      file: uploads[0],
    });
  } catch (uploadError) {
    const message = uploadError instanceof Error ? uploadError.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
