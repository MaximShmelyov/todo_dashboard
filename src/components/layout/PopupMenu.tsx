import Button from "@/src/components/ui/Button";

export interface PopupMenuItem {
  readonly id: string;
  readonly title: string;
}

export interface PopupMenuParams {
  readonly popupMenuItems: readonly PopupMenuItem[];
  readonly onItemSelected: (item: PopupMenuItem) => void;
}

interface PopupMenuProps extends PopupMenuParams {
  open: boolean;
}

export default function PopupMenu({ open, popupMenuItems, onItemSelected }: PopupMenuProps) {
  return (
    <>
      {open && (
        <div className="absolute rounded-xl right-0 py-4 mt-8 w-56 shadow-lg bg-white divide-x divide-gray-300 ring-1 ring-black/5">
          <ul className="flex flex-col ">
            {popupMenuItems.map((item) => (
              <Button key={item.id} className="mx-4" onClick={() => onItemSelected(item)}>
                {item.title}
              </Button>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
