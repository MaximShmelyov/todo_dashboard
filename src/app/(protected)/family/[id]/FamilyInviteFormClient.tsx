"use client";

import { Family, RoleType } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import ModalDialog from "@/src/components/common/ModalDialog";
import ModalDialogTitle from "@/src/components/common/ModalDialogTitle";
import Button from "@/src/components/ui/Button";
import Select from "@/src/components/ui/Select";
import { createInvite, FamilyInviteExtended, updateInvite } from "@/src/db/actions/invite";
import { RoleTypeLimited } from "@/src/db/actions/membership";

type FamilyInviteFormProps =
  | {
      mode: "create";
      families: Family[];
      inviteRoleTypes: RoleType[];
    }
  | {
      mode: "edit";
      invite: FamilyInviteExtended;
      inviteRoleTypes: RoleType[];
    };

export default function FamilyInviteFormClient(props: FamilyInviteFormProps) {
  const router = useRouter();
  const initialFocusRef = useRef<HTMLSelectElement>(null);
  const [loading, setLoading] = useState(false);
  const inviteRoleTypes = props.inviteRoleTypes;
  const invite: FamilyInviteExtended = props.mode === "edit" ? props.invite : null;
  const families: Family[] | null = props.mode === "create" ? props.families : null;

  useEffect(() => {
    if ((!invite && (!families || families.length === 0)) || (invite && !!invite.usedBy))
      router.replace("/family");
  }, [families, invite, props, router]);

  if (!invite && (!families || families.length === 0)) {
    return <div>Redirecting</div>;
  }

  return (
    <ModalDialog
      initialFocus={initialFocusRef as React.RefObject<HTMLElement>}
      onCloseAction={() => router.back()}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const formData = new FormData(e.currentTarget);
          const familyId = formData.get("familyId")!.toString();
          const disabled = formData.has("disabled");
          const roleType = formData.get("roleType")!.toString() as RoleTypeLimited;
          if (props.mode === "create") {
            await createInvite(disabled, familyId, roleType);
          } else if (props.mode === "edit") {
            await updateInvite({
              id: invite!.id,
              disabled,
              roleType,
            });
          }
          router.replace(`/family/${familyId}`);
        }}
      >
        <ModalDialogTitle>{invite ? `Edit invite` : "Create invite"}</ModalDialogTitle>
        <label className="flex flex-col gap-1">
          Family:
          <Select
            name="familyId"
            defaultValue={invite ? invite.family.id : ""}
            required
            ref={initialFocusRef}
            disabled={loading}
          >
            {invite ? (
              <option value={invite.family.id}>{invite.family.name}</option>
            ) : (
              <>
                {(!families?.length || families?.length > 1) && (
                  <option value="" disabled>
                    -
                  </option>
                )}
                {families!.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.name}
                  </option>
                ))}
              </>
            )}
          </Select>
        </label>
        <label className="flex flex-col gap-1">
          Role:
          <Select
            name="roleType"
            defaultValue={invite ? invite.roleType : RoleType.USER}
            disabled={loading}
          >
            {inviteRoleTypes.map((roleType) => (
              <option key={roleType} value={roleType}>
                {roleType}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex items-center gap-2 select-none">
          <input
            type="checkbox"
            name="disabled"
            defaultChecked={invite ? invite.disabled : false}
            className="accent-red-500 w-4 h-4"
            disabled={loading}
          />
          Disabled
        </label>
        <Button type="submit" loading={loading}>
          Submit
        </Button>
      </form>
    </ModalDialog>
  );
}
