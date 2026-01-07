import {prisma} from '@/src/db';
import {Membership} from "@prisma/client";

export async function getMembership(id: Membership['id']) {
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
  })
}