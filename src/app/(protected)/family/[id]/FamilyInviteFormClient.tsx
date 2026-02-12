"use client";

import { useRouter } from "next/navigation";
import Form from "next/form";
import { Family, RoleType } from "@prisma/client";
import { createInvite, FamilyInviteExtended, updateInvite } from "@/src/db/actions/invite";
import { RoleTypeLimited } from "@/src/db/actions/membership";
import { useEffect } from "react";
import Button from "@/src/components/ui/Button";
import ModalDialog from "@/src/components/common/ModalDialog";
import ModalDialogTitle from "@/src/components/common/ModalDialogTitle";

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
    <ModalDialog onCloseAction={() => router.back()}>
      <Form
        className="flex flex-col gap-4"
        action={async (formData) => {
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
        <label>
          Family:
          <select
            className="not-dark:hover:bg-stone-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
            name="familyId"
            defaultValue={invite ? invite.family.id : ""}
            required
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
          </select>
        </label>
        <label>
          Role:
          <select
            className="not-dark:hover:bg-stone-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
            name="roleType"
            defaultValue={invite ? invite.roleType : RoleType.USER}
          >
            {inviteRoleTypes.map((roleType) => (
              <option key={roleType} value={roleType}>
                {roleType}
              </option>
            ))}
          </select>
        </label>
        <label>
          Disabled:{" "}
          <input
            type="checkbox"
            name="disabled"
            defaultChecked={invite ? invite.disabled : false}
          />
        </label>
        <Button type="submit">Submit</Button>
      </Form>
    </ModalDialog>
  );
}
