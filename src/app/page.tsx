import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/authOptions";
// export const runtime = 'nodejs';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      {session ? (
        <p>Hi, {session.user?.name}</p>
      ) : (
        <p>You&#39;re not logged in</p>
      )}
    </div>
  );
}
