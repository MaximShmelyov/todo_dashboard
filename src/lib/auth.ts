import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export type AppSession = {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
  };
};

/**
 * Wrapper around NextAuth JWT session to be used inside route handlers.
 * Requires NEXTAUTH_SECRET to be set.
 */
export async function getSession(req: Request): Promise<AppSession | null> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return null;
  }

  try {
    // Wrap Fetch API Request into NextRequest to satisfy getToken typings
    const nextReq = new NextRequest(req);

    const token = await getToken({ req: nextReq, secret });
    if (!token) return null;

    const id = token.sub ?? token.userId;
    if (!id) return null;

    return {
      user: {
        id,
        email: token.email ?? null,
        name: token.name ?? null,
      },
    };
  } catch {
    return null;
  }
}