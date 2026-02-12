"use client";

import { deleteMembership } from "@/src/db/actions/membership";
import { Family } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LeaveFamilyWidgetDialog from "@/src/app/(protected)/family/[id]/LeaveFamilyWidgetDialog";
import Button from "@/src/components/ui/Button";

export default function LeaveFamilyWidget({
  familyName,
  familyId,
}: {
  familyName: Family["name"];
  familyId: Family["id"];
}) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);

  const handleLeaveClick = async () => {
    setShowDialog(true);
  };
  const handleConfirmLeave = async () => {
    if (await deleteMembership(familyId)) {
      router.push("/family");
    } else {
      // @TODO
    }
    setShowDialog(false);
  };

  return (
    <>
      {showDialog && (
        <LeaveFamilyWidgetDialog
          onConfirmAction={handleConfirmLeave}
          onCancelAction={() => setShowDialog(false)}
          familyName={familyName}
        />
      )}
      <Button variant={"secondary"} onClick={handleLeaveClick}>
        Leave
      </Button>
    </>
  );
}
