import Link from "next/link";
import { getCollectionRoute } from "@/src/lib/utils";
import { CollectionType } from "@prisma/client";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const linkClass = "px-3 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-gray-600 transition";

  return (
    <>
      <Link href="/" className="text-2xl font-semibold" onClick={onNavigate}>
        🏠 Home
      </Link>

      <nav className="flex flex-col gap-2 mt-8">
        <Link
          onClick={onNavigate}
          className={linkClass}
          href={getCollectionRoute(CollectionType.SHOPPING)}
        >
          🛍 Shopping
        </Link>
        <Link
          onClick={onNavigate}
          className={linkClass}
          href={getCollectionRoute(CollectionType.NOTE)}
        >
          📝 Notes
        </Link>
        <Link
          onClick={onNavigate}
          className={linkClass}
          href={getCollectionRoute(CollectionType.TODO)}
        >
          ✔️ Todos
        </Link>
        <Link onClick={onNavigate} className={linkClass} href="/family">
          👪 Family
        </Link>
        <Link onClick={onNavigate} className={linkClass} href="/settings">
          ⚙️ Settings
        </Link>
        <div className="mt-8 text-stone-400 dark:text-stone-500 italic select-none opacity-60 text-xs">
          Ver: {process.env.NEXT_PUBLIC_APP_VERSION ?? "local"}
        </div>
      </nav>
    </>
  );
}
