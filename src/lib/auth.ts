import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/authOptions";

// export type AppSession = {
//   user: {
//     id: string;
//     email?: string | null;
//     name?: string | null;
//   };
// };

/**
 * Wrapper around NextAuth JWT session to be used inside route handlers.
 * Requires NEXTAUTH_SECRET to be set.
 */
export async function getSession() {
  return getServerSession(authOptions);
}
