"use server";

import { getSession } from "@/src/lib/auth";
import { prisma } from "@/src/db";
import { Family, Membership, Prisma, RoleType } from "@prisma/client";

export async function getAuthorId(): Promise<string> {
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
  });
  return families.map((family) => family.id);
}

export async function checkFamilyMember(familyId: Family["id"]): Promise<boolean> {
  const userId = await getAuthorId();
  return !!(await prisma.membership.findFirst({
    where: {
      familyId,
      userId,
    },
  }));
}

export async function getFamilyMemberRole(familyId: Family["id"]): Promise<RoleType | undefined> {
  const userId = await getAuthorId();
  return (
    await prisma.membership.findFirst({
      where: {
        familyId,
        userId,
      },
    })
  )?.roleType;
}

export async function checkFamilyMembershipRole(
  familyId: Family["id"],
  roleType: Membership["roleType"],
  checkDescending: boolean = false,
): Promise<boolean> {
  const userId = await getAuthorId();
  const membership = await prisma.membership.findFirst({
    where: {
      familyId,
      userId,
    },
  });

  if (!membership) return false;
  if (!checkDescending) return membership.roleType === roleType;

  const exhaustiveGuardRoleType = (_: never): never => {
    throw new Error("Got unexpected value here.");
  };

  switch (membership.roleType) {
    case RoleType.ADMIN:
      return true; // ADMIN has all the rights
    case RoleType.MODERATOR:
      return roleType === RoleType.MODERATOR || roleType === RoleType.USER; // MODERATOR is USER too
    case RoleType.USER:
      return roleType === RoleType.USER; // USER means USER, lowest role
    default:
      return exhaustiveGuardRoleType(membership.roleType);
  }
}
