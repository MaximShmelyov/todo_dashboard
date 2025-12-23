import {Collection} from "@prisma/client";
import { getSession } from "@/src/lib/auth"
import {getShopping} from "@/src/db/actions/shopping";

export default async function ShoppingList({params}: {searchParams: Promise<{id: string}>}) {
  const session = await getSession();
  const paramsObj = await params;
  if (!session) return "Loading";
  if (!paramsObj.id) return <div>No ID provided</div>;

  const shopping: Omit<Collection, "type"> = await getShopping(paramsObj.id);

  if (!shopping) return <div>404 Not Found</div>;

  return (
    <>
      {shopping.title}
    </>
  );
}