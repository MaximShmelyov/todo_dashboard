import Button from "@/src/components/ui/Button";

export default function DeleteSelectedButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  if (count === 0) return null;
  return (
    <Button onClick={onClick} variant="delete" className="shrink-0 max-w-full">
      {`Delete selected (${count})`}
    </Button>
  );
}
