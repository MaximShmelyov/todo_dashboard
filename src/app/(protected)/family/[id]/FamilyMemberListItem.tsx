"use client";

import { RoleType } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import ConfirmPopup from "@/src/components/layout/ConfirmPopup";
import Button from "@/src/components/ui/Button";
import { removeFamilyMember } from "@/src/db/actions/membership";

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
    <div
      className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg shadow-sm border hover:shadow-md transition
                  dark:bg-neutral-900 dark:border-neutral-700"
    >
      <div className="flex items-center gap-3">
        {membership.user.image ? (
          <Image
            src={membership.user.image}
            alt={membership.user.name ?? "User"}
            width={40}
            height={40}
            className="rounded-full object-cover border dark:border-neutral-700"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border
                        dark:text-neutral-500 dark:border-neutral-700"
          >
            <span className="text-lg">{membership.user.name?.charAt(0).toUpperCase() ?? "?"}</span>
          </div>
        )}
        <div>
          <div className="font-medium">{membership.user.name ?? "No name"}</div>
          <div className="text-xs">{membership.roleType}</div>
        </div>
      </div>
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
