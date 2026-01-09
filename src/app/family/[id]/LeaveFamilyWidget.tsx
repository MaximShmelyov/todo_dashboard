'use client'

import {deleteMembership} from "@/src/db/actions/membership";
import {Family} from "@prisma/client";
import {useRouter} from "next/navigation";
import {useState} from "react";
import LeaveFamilyWidgetDialog from "@/src/app/family/[id]/LeaveFamilyWidgetDialog";

export default function LeaveFamilyWidget({familyName, familyId}: {
  familyName: Family['name'],
  familyId: Family['id']
}) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);

  const handleLeaveClick = async () => {
    setShowDialog(true);
  };
  const handleConfirmLeave = async () => {
    if (await deleteMembership(familyId)) {
      router.push('/family');
    } else {
      // @TODO
    }
    setShowDialog(false);
  };

  return (
    <>
      {showDialog && <LeaveFamilyWidgetDialog onConfirm={handleConfirmLeave} onCancel={() => setShowDialog(false)}
                                              familyName={familyName}/>}
      <button
        className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200"
        onClick={handleLeaveClick}
      >
        Leave
      </button>
    </>
  )
    ;
}