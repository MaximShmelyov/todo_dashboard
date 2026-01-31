import { SidebarContent } from "./SidebarContent";

export function DesktopSidebar() {
  return (
    <aside className="hidden md:block w-64 bg-amber-50 dark:bg-gray-800 border-r border-stone-200 dark:border-gray-700 p-6 sticky top-0 h-screen">
      <SidebarContent />
    </aside>
  );
}
