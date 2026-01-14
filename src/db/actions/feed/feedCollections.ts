import { prisma } from "@/src/db";
import { Collection, CollectionType } from "@prisma/client";
import { getAuthorId, getFamiliesIds } from "@/src/db/actions/util";

function startOfDayUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export async function getFeedCollections(
  daysBefore: number = 0,
): Promise<Record<CollectionType, Collection[]>> {
  const ownerId = await getAuthorId();

  const now = new Date();
  const fromDate = startOfDayUTC(
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysBefore)),
  );

  return Object.fromEntries(
    await Promise.all(
      Object.values(CollectionType).map(async (type) => [
        type,
        await prisma.collection.findMany({
          where: {
            OR: [
              {
                ownerId,
              },
              {
                familyId: {
                  in: await getFamiliesIds(),
                },
              },
            ],
            type,
            updatedAt: {
              gte: fromDate,
            },
          },
          orderBy: { updatedAt: "desc" },
          take: 3,
        }),
      ]),
    ),
  ) as Record<CollectionType, Collection[]>;
}
