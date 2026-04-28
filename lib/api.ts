import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";

export async function parseBody<T>(request: Request, schema: ZodSchema<T>) {
  const json = await request.json();
  return schema.parse(json);
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(error: unknown, fallbackMessage = "Something went wrong", status = 400) {
  if (error instanceof ZodError) {
    return apiError("Invalid request data.", 422);
  }

  return apiError(fallbackMessage, status);
}
