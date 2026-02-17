"use server";

import { FamilyInvite, RoleType } from "@prisma/client";
import { prisma } from "@/src/db";
import { getAuthorId, getFamilyMemberRole } from "@/src/db/actions/util";
import { getAllowedRoleTypesForInviteIssuer } from "@/src/lib/utils";

export async function createInvite(
  disabled: FamilyInvite["disabled"],
  familyId: FamilyInvite["familyId"],
  roleType: FamilyInvite["roleType"],
): Promise<string | null> {
  const authorId = await getAuthorId();

  const allowedRoleTypes: RoleType[] = getAllowedRoleTypesForInviteIssuer(
    await getFamilyMemberRole(familyId),
  );
  if (!allowedRoleTypes.some((allowedRoleType) => allowedRoleType === roleType)) {
    return null;
  }

  const invite = await prisma.familyInvite.create({
    data: {
      disabled,
      familyId,
      roleType,
      issuedById: authorId,
    },
  });
  return invite?.id;
}

export type FamilyInviteExtended = Awaited<ReturnType<typeof getInvite>>;

export async function getInvite(id: FamilyInvite["id"]) {
  const authorId = await getAuthorId();

  return await prisma.$transaction(async (transaction) => {
    const invite = await transaction.familyInvite.findUnique({
      where: {
        id,
      },
      include: {
        family: true,
        issuedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        usedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    if (!invite) {
      // No invite found
      return null;
    }
    if (invite.issuedById === authorId) {
      // Client is an issuer
      return invite;
    }
    const adminMember = await transaction.membership.findFirst({
      where: {
        familyId: invite.familyId,
        userId: authorId,
        roleType: RoleType.ADMIN,
      },
    });
    if (adminMember) {
      // Client is an admin
      return invite;
    }
    return null;
  });
}

export async function updateInvite(
  invite: Pick<FamilyInvite, "id"> & Partial<Pick<FamilyInvite, "disabled" | "roleType">>,
) {
  const authorId = await getAuthorId();

  const existing = await prisma.familyInvite.findUnique({
    where: { id: invite.id },
    select: {
      issuedById: true,
      familyId: true,
    },
  });

  if (!existing) throw new Error("Invite not found");

  if (existing.issuedById !== authorId) {
    const member = await prisma.membership.findFirst({
      where: {
        familyId: existing.familyId,
        userId: authorId,
        roleType: { in: [RoleType.ADMIN, RoleType.MODERATOR] },
      },
    });
    if (!member) throw new Error("Forbidden");
  }

  await prisma.familyInvite.update({
    where: { id: invite.id },
    data: {
      ...invite,
    },
  });
}

export async function activateInvite(id: FamilyInvite["id"]): Promise<boolean> {
  const usedById = await getAuthorId();

  return await prisma.$transaction(async (transaction) => {
    const invite = await transaction.familyInvite.findUnique({
      where: {
        id,
        disabled: false,
        usedById: null,
        usedAt: null,
      },
      include: {
        family: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!invite) return false;

    if (
      !!(await transaction.membership.findFirst({
        where: {
          userId: usedById,
          familyId: invite.family.id,
        },
      }))
    ) {
      console.debug("Already family member");
      return false;
    }

    if (
      !!(await transaction.familyInvite.update({
        where: {
          id,
        },
        data: {
          usedById,
          usedAt: new Date(),
        },
      }))
    ) {
      return !!(await transaction.membership.create({
        data: {
          userId: usedById,
          familyId: invite.family.id,
          roleType: invite.roleType,
        },
      }));
    }
    return false;
  });
}

export type FamilyInvitePublic = Awaited<ReturnType<typeof getInvitePublic>>;

export async function getInvitePublic(id: FamilyInvite["id"]) {
  return await prisma.familyInvite.findUnique({
    where: {
      id,
      disabled: false,
      usedById: null,
      usedAt: null,
    },
    include: {
      family: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function deleteInvite(id: string) {
  const authorId = await getAuthorId();

  const invite = await prisma.familyInvite.findUnique({
    where: { id },
    select: {
      issuedById: true,
      familyId: true,
    },
  });

  if (!invite) throw new Error("Invite not found");

  if (invite.issuedById !== authorId) {
    const member = await prisma.membership.findFirst({
      where: {
        familyId: invite.familyId,
        userId: authorId,
        roleType: { in: [RoleType.ADMIN, RoleType.MODERATOR] },
      },
    });
    if (!member) throw new Error("Forbidden");
  }

  await prisma.familyInvite.delete({ where: { id } });
}
