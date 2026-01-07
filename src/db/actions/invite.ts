'use server'

import {FamilyInvite, RoleType} from "@prisma/client";
import {prisma} from "@/src/db";
import {getAuthorId} from "@/src/db/actions/util";

export async function createInvite(disabled: FamilyInvite['disabled'],
                                   familyId: FamilyInvite['familyId'],
                                   roleType: FamilyInvite['roleType']): Promise<string | null> {
  const authorId = await getAuthorId();

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
export async function getInvite(id: FamilyInvite['id']) {
  const authorId = await getAuthorId();

  return await prisma.$transaction(async (transaction) => {
    const invite = await transaction.familyInvite.findUnique({
      where: {
        id
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

export async function updateInvite(invite: Pick<FamilyInvite, 'id'> & Partial<Pick<FamilyInvite, 'disabled' | 'roleType'>>) {
  await prisma.familyInvite.update({
    where: {
      id: invite.id,
    },
    data: {
      ...invite,
    },
  });
}