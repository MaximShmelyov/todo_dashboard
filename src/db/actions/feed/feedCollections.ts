import {prisma} from "@/src/db";
import {Collection, CollectionType} from "@prisma/client";
import {getSession} from "@/src/lib/auth";

function startOfDayUTC(date: Date): Date {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  ));
}

export async function getFeedCollections(daysBefore: number = 0): Promise<Record<CollectionType, Collection[]>> {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const now = new Date();
  const fromDate = startOfDayUTC(
    new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - daysBefore,
    ))
  );

  return Object.fromEntries(
    await Promise.all(
      Object.values(CollectionType).map(async type => [
        type,
        await prisma.collection.findMany({
          where: {
            ownerId: session.user.id,
            type,
            updatedAt: {
              gte: fromDate,
            },
          },
          orderBy: { updatedAt: 'desc' },
          take: 3,
        }),
      ])
    )
  ) as Record<CollectionType, Collection[]>;
}