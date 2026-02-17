"use client";

import VerticalListItem from "@/src/components/ui/list/VerticalListItem";
import { FamilyInvite } from "@prisma/client";
import { FamilyExtended } from "@/src/db/actions/family";
import Button from "@/src/components/ui/Button";
import { deleteInvite } from "@/src/db/actions/invite";
import { useRouter } from "next/navigation";
import ConfirmPopup from "@/src/components/layout/ConfirmPopup";
import React, { useState } from "react";

export default function FamilyInviteListItem({
  familyInvite,
  hasAccessToEdit,
}: {
  familyInvite: NonNullable<FamilyExtended>["familyInvite"][number];
  hasAccessToEdit: boolean;
}) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCopy = async (id: string) => {
    const origin: string = window.location.origin;
    await navigator.clipboard.writeText(`${origin}/family/invites/${id}`);
  };

  const handleDelete = async () => {
    await deleteInvite(familyInvite.id);
    setShowConfirm(false);
    router.refresh();
  };

  const inviteUsed = isInviteUsed(familyInvite);

  return (
    <>
      <VerticalListItem
        key={familyInvite.id}
        href={!inviteUsed && hasAccessToEdit ? `?inviteEdit=${familyInvite.id}` : null}
      >
        <div className={familyInvite.disabled ? "bg-red-50 dark:bg-red-800" : ""}>
          {familyInvite.roleType} -{" "}
          <span className="font-semibold">{familyInvite.usedBy?.email ?? "Available"}</span> created
          at {familyInvite.createdAt.toLocaleString()}
          {familyInvite.disabled ? <span> - disabled</span> : null}
        </div>
        <div className="flex gap-2">
          {!inviteUsed && (
            <>
              <Button
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  await handleCopy(familyInvite.id);
                }}
              >
                Copy
              </Button>
              {hasAccessToEdit && (
                <Button
                  variant="delete"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirm(true);
                  }}
                >
                  Delete
                </Button>
              )}
            </>
          )}
        </div>
      </VerticalListItem>
      {showConfirm && (
        <ConfirmPopup
          title="Delete this invite?"
          onCancelAction={() => setShowConfirm(false)}
          onConfirmAction={handleDelete}
        />
      )}
    </>
  );
}

function isInviteUsed(invite: { usedAt: FamilyInvite["usedAt"] }): boolean {
  return Boolean(invite.usedAt);
}
