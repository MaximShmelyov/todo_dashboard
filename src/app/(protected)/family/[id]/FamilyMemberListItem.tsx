"use client";

import Button from "@/src/components/ui/Button";
import ConfirmPopup from "@/src/components/layout/ConfirmPopup";
import { removeFamilyMember } from "@/src/db/actions/membership";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { RoleType } from "@prisma/client";

type FamilyMemberShort = {
  id: string;
  roleType: RoleType;
  user: {
    id: string;
    name: string | null;
    image?: string | null;
  };
};

export default function FamilyMemberListItem({
  membership,
  canRemove,
  canEdit,
}: {
  membership: FamilyMemberShort;
  canRemove: boolean;
  canEdit: boolean;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    await removeFamilyMember(membership.id);
    setShowConfirm(false);
    router.refresh();
  };

  const handleEdit = () => {
    router.push(`?updateMembership=${membership.id}`);
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <span>
        {membership.user.name} : {membership.roleType}
      </span>
      <div className="flex gap-2">
        {canEdit && <Button onClick={handleEdit}>Edit</Button>}
        {canRemove && (
          <>
            <Button variant="delete" onClick={() => setShowConfirm(true)}>
              Remove
            </Button>
            {showConfirm && (
              <ConfirmPopup
                title={`Remove ${membership.user.name} from family?`}
                onCancelAction={() => setShowConfirm(false)}
                onConfirmAction={handleRemove}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
