"use server";

import { Family, Membership, RoleType } from "@prisma/client";

import { prisma } from "@/src/db";
import { getAuthorId } from "@/src/db/actions/util";

export type MembershipExtended = NonNullable<Awaited<ReturnType<typeof getMembership>>>;

export async function getMembership(id: Membership["id"]) {
  return await prisma.membership.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      family: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export type RoleTypeLimited = Exclude<keyof typeof RoleType, "ADMIN">;

export async function updateMembership(
  membership: { roleType: RoleTypeLimited } & Pick<Membership, "id">,
) {
  const authorId = await getAuthorId();

  await prisma.$transaction(async (tx) => {
    const target = await tx.membership.findUnique({
      where: { id: membership.id },
      select: { familyId: true },
    });

    if (!target) {
      throw new Error("Membership not found");
    }

    const hasAccess = await tx.membership.findFirst({
      where: {
        userId: authorId,
        familyId: target.familyId,
        roleType: { in: ["ADMIN"] },
      },
    });

    if (!hasAccess) {
      throw new Error("Access denied");
    }

    await tx.membership.update({
      where: { id: membership.id, NOT: { roleType: "ADMIN" } },
      data: {
        roleType: membership.roleType,
      },
    });
  });
}

export async function deleteMembership(familyId: Family["id"]): Promise<boolean> {
  const userId = await getAuthorId();
  return (
    (
      await prisma.membership.deleteMany({
        where: {
          familyId,
          userId,
          NOT: {
            roleType: RoleType.ADMIN,
          },
        },
      })
    ).count > 0
  );
}

export async function removeFamilyMember(membershipId: string) {
  const authorId = await getAuthorId();

  const membership = await prisma.membership.findUnique({
    where: { id: membershipId },
    select: { familyId: true, userId: true, roleType: true },
  });
  if (!membership) throw new Error("Membership not found");

  if (membership.userId === authorId) throw new Error("Cannot remove yourself");

  const authorMembership = await prisma.membership.findFirst({
    where: {
      familyId: membership.familyId,
      userId: authorId,
    },
    select: { roleType: true },
  });
  if (!authorMembership) throw new Error("Forbidden");

  if (!([RoleType.ADMIN, RoleType.MODERATOR] as RoleType[]).includes(authorMembership.roleType)) {
    throw new Error("Forbidden");
  }

  if (
    authorMembership.roleType === RoleType.MODERATOR &&
    (membership.roleType === RoleType.ADMIN || membership.roleType === RoleType.MODERATOR)
  ) {
    throw new Error("Forbidden");
  }

  await prisma.membership.delete({ where: { id: membershipId } });
}
