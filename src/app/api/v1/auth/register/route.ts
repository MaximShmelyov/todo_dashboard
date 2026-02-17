import { NextResponse } from "next/server";

import { RegisterBodySchema } from "@/src/app/api/v1/auth/schema";

import type { ApiError, ApiSuccess } from "@/src/types/api";

type RegisterData = { url: string };

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json<ApiError>({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = RegisterBodySchema.safeParse(json);
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

  const authStartUrl = new URL(`${origin}/api/auth/signin/${provider}`);
  authStartUrl.searchParams.set("callbackUrl", callbackUrl ?? origin);

  if (redirect) {
    return NextResponse.redirect(authStartUrl.toString(), { status: 302 });
  }

  return NextResponse.json<ApiSuccess<RegisterData>>(
    { success: true, data: { url: authStartUrl.toString() } },
    { status: 200 },
  );
}
