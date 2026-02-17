import { NextResponse } from "next/server";

import {
  PaginationQuerySchema,
  CreateCollectionBodySchema,
} from "@/src/app/api/v1/collections/schema";
import { prisma } from "@/src/db";
import { getSession } from "@/src/lib/auth";

import type { ApiError, ApiSuccess, Paginated } from "@/src/types/api";
import type { Collection, CollectionType } from "@prisma/client";

export function createCollectionAliasApi(collectionType: CollectionType) {
  async function GET(req: Request) {
    const session = await getSession();
    if (!session) {
      return NextResponse.json<ApiError>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const url = new URL(req.url);
    const query = {
      page: url.searchParams.get("page"),
      pageSize: url.searchParams.get("pageSize"),
    };
    const parsed = PaginationQuerySchema.safeParse(query);
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

    const { page, pageSize } = parsed.data;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where = { ownerId: session.user.id, type: collectionType };

    const [items, total] = await prisma.$transaction([
      prisma.collection.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.collection.count({ where }),
    ]);

    const pages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json<ApiSuccess<Paginated<Collection>>>(
      { success: true, data: { items, page, pageSize, total, pages } },
      { status: 200 },
    );
  }

  async function POST(req: Request) {
    const session = await getSession();
    if (!session) {
      return NextResponse.json<ApiError>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    let json: unknown;
    try {
      json = await req.json();
    } catch (e) {
      console.error(e);
      return NextResponse.json<ApiError>(
        { success: false, error: "Invalid JSON" },
        { status: 400 },
      );
    }

    const parsed = CreateCollectionBodySchema.safeParse(json);
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

    const { title, familyId, isPublic } = parsed.data;

    const collection = await prisma.collection.create({
      data: {
        title,
        type: collectionType,
        isPublic: Boolean(isPublic),
        ownerId: session.user.id,
        familyId: familyId ?? null,
      },
    });

    return NextResponse.json<ApiSuccess<Collection>>(
      { success: true, data: collection },
      { status: 201 },
    );
  }

  return { GET, POST };
}
