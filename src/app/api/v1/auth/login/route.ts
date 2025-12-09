import { NextResponse } from "next/server";
import { z } from "zod";
import type { ApiError, ApiSuccess } from "@/src/types/api";

const LoginBodySchema = z.object({
  provider: z.literal("google"),
  callbackUrl: z.string().url().optional(),
  // If true, endpoint will respond with 302 redirect to OAuth start URL
  redirect: z.boolean().optional().default(false),
});

type LoginData = {
  url: string;
};

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json<ApiError>(
      { success: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const parsed = LoginBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "Validation error",
        details: parsed.error.flatten((issue) => issue.message),
      },
      { status: 400 },
    );
  }

  const { provider, callbackUrl, redirect } = parsed.data;
  const origin = new URL(req.url).origin;

  // Build NextAuth sign-in URL for the provider
  const authStartUrl = new URL(`${origin}/api/auth/signin/${provider}`);
  authStartUrl.searchParams.set("callbackUrl", callbackUrl ?? origin);

  if (redirect) {
    return NextResponse.redirect(authStartUrl.toString(), { status: 302 });
  }

  return NextResponse.json<ApiSuccess<LoginData>>(
    { success: true, data: { url: authStartUrl.toString() } },
    { status: 200 },
  );
}