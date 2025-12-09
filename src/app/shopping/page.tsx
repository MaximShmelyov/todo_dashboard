import type {Metadata} from "next";
import AddButton from "@/src/components/ui/buttons/AddButton";
import VerticalList from "@/src/components/ui/list/VerticalList";
import VerticalListItem from "@/src/components/ui/list/VerticalListItem";

export const metadata: Metadata = {
  title: 'Shopping',
};

export default function Shopping() {
  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">🛍 Shopping list</h2>
        <AddButton>
          + Add
        </AddButton>
      </div>

      <VerticalList>
        <VerticalListItem>
          <div>
            <input className="mr-4 w-6 h-6" type="checkbox"/>
            <span className="text-stone-800">Milk</span>
          </div>
          <span className="text-sm text-stone-500">(family)</span>
        </VerticalListItem>

        <VerticalListItem>
          <div>
            <input className="mr-4 w-6 h-6" type="checkbox"/>
            <span className="text-stone-800">Bread</span>
          </div>
          <span className="text-sm text-stone-500">(my list)</span>
        </VerticalListItem>
      </VerticalList>
    </div>
  );
}
