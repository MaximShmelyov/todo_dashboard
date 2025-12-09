import { NextResponse } from "next/server";
import { prisma } from "@/src/db";
import { getSession } from "@/src/lib/auth";
import type { ApiError, ApiSuccess } from "@/src/types/api";
import type { Collection } from "@prisma/client";
import { UpdateCollectionBodySchema } from "@/src/app/api/v1/collections/schema";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const session = await getSession(_req);
  if (!session) {
    return NextResponse.json<ApiError>({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = ctx.params;

  const collection = await prisma.collection.findUnique({ where: { id } });
  if (!collection || collection.ownerId !== session.user.id) {
    return NextResponse.json<ApiError>({ success: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json<ApiSuccess<Collection>>({ success: true, data: collection }, { status: 200 });
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json<ApiError>({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = ctx.params;

  const existing = await prisma.collection.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== session.user.id) {
    return NextResponse.json<ApiError>({ success: false, error: "Not found" }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json<ApiError>({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = UpdateCollectionBodySchema.safeParse(json);
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

  const data: Record<string, unknown> = {};
  const { title, type, isPublic, familyId } = parsed.data;

  if (typeof title !== "undefined") data.title = title;
  if (typeof isPublic !== "undefined") data.isPublic = isPublic;
  if (typeof familyId !== "undefined") data.familyId = familyId ?? null;
  if (typeof type !== "undefined") data.typeId = type; // coerced to number by schema

  const updated = await prisma.collection.update({
    where: { id },
    data,
  });

  return NextResponse.json<ApiSuccess<Collection>>({ success: true, data: updated }, { status: 200 });
}

export async function DELETE(req: Request, ctx: { params: { id: string } }) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json<ApiError>({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = ctx.params;

  const existing = await prisma.collection.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== session.user.id) {
    return NextResponse.json<ApiError>({ success: false, error: "Not found" }, { status: 404 });
  }

  const deleted = await prisma.collection.delete({ where: { id } });

  return NextResponse.json<ApiSuccess<Collection>>({ success: true, data: deleted }, { status: 200 });
}