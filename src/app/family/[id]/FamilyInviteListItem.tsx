"use client";

import VerticalListItem from "@/src/components/ui/list/VerticalListItem";
import { FamilyInvite } from "@prisma/client";
import { FamilyExtended } from "@/src/db/actions/family";
import Button from "@/src/components/ui/Button";

export default function FamilyInviteListItem({
  familyInvite,
  hasAccessToEdit,
}: {
  familyInvite: NonNullable<FamilyExtended>["familyInvite"][number];
  hasAccessToEdit: boolean;
}) {
  const handleCopy = async (id: string) => {
    const origin: string = window.location.origin;
    await navigator.clipboard.writeText(`${origin}/family/invites/${id}`);
  };

  return (
    <VerticalListItem
      key={familyInvite.id}
      href={
        !isInviteUsed(familyInvite) &&
        hasAccessToEdit /* @TODO: allow MODERATORs edit their invites */
          ? `?inviteEdit=${familyInvite.id}`
          : null
      }
    >
      <div className={familyInvite.disabled ? "bg-red-50" : ""}>
        {familyInvite.roleType} -{" "}
        <span className="font-semibold">{familyInvite.usedBy?.email ?? "Available"}</span> created
        at {familyInvite.createdAt.toLocaleString()}
        {familyInvite.disabled ? <span> - disabled</span> : <></>}
      </div>
      <Button
        hidden={isInviteUsed(familyInvite)}
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await handleCopy(familyInvite.id);
        }}
      >
        Copy
      </Button>
    </VerticalListItem>
  );
}

function isInviteUsed(invite: { usedAt: FamilyInvite["usedAt"] }): boolean {
  return Boolean(invite.usedAt);
}
