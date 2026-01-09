'use server'

import {getSession} from "@/src/lib/auth";
import {prisma} from "@/src/db";
import {Family, Prisma} from "@prisma/client";

export async function getAuthorId() : Promise<string> {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export async function getFamiliesIds(transaction?: Prisma.TransactionClient): Promise<string[]> {
  const userId = await getAuthorId();
  const families = await (transaction ? transaction : prisma).family.findMany({
      where: {
        memberships: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
      },
    }
  );
  return families.map(family => family.id);
}

export async function checkFamilyMember(familyId: Family['id']): Promise<boolean> {
  const userId = await getAuthorId();
  return !!await prisma.membership.findFirst({
    where: {
      familyId,
      userId,
    },
  });
}