'use server'

import {getSession} from "@/src/lib/auth";

export async function getAuthorId() : Promise<string> {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}