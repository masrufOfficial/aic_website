import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/rate-limit";

const ALLOWED_MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const sameOriginMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function getRequestOrigin(request: Request) {
  return request.headers.get("origin");
}

function getRequestHost(request: Request) {
  return request.headers.get("host");
}

function getForwardedProto(request: Request) {
  return request.headers.get("x-forwarded-proto") || "http";
}

export function validateRequestOrigin(request: Request) {
  if (!sameOriginMethods.has(request.method)) {
    return null;
  }

  const origin = getRequestOrigin(request);
  const host = getRequestHost(request);

  if (!origin || !host) {
    return NextResponse.json({ error: "Unauthorized request." }, { status: 403 });
  }

  const expectedOrigin = `${getForwardedProto(request)}://${host}`;

  if (origin !== expectedOrigin) {
    return NextResponse.json({ error: "Unauthorized request." }, { status: 403 });
  }

  return null;
}

export function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || request.headers.get("host") || "unknown";
}

export function enforceRateLimit(
  request: Request,
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
) {
  const clientKey = `${key}:${getClientIdentifier(request)}`;
  const result = rateLimit(clientKey, { limit, windowMs });

  if (result.success) {
    return null;
  }

  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
      },
    }
  );
}

export function enforceMutationSecurity(
  request: Request,
  options?: {
    rateLimitKey?: string;
    limit?: number;
    windowMs?: number;
  }
) {
  if (!ALLOWED_MUTATION_METHODS.has(request.method)) {
    return null;
  }

  const originError = validateRequestOrigin(request);
  if (originError) {
    return originError;
  }

  if (options?.rateLimitKey && options.limit && options.windowMs) {
    return enforceRateLimit(request, options.rateLimitKey, {
      limit: options.limit,
      windowMs: options.windowMs,
    });
  }

  return null;
}

export function sanitizePlainText(input: string) {
  return input.replace(/[<>]/g, "").trim();
}
