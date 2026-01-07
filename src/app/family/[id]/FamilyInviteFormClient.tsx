'use client'

import {useRouter} from "next/navigation";
import Form from "next/form";
import {Family, RoleType} from "@prisma/client";
import {createInvite, FamilyInviteExtended, updateInvite} from "@/src/db/actions/invite";
import {RoleTypeLimited} from "@/src/db/actions/membership";
import {useEffect} from "react";

type FamilyInviteFormProps =
  | {
  mode: 'create',
  families: Family[],
}
  | {
  mode: 'edit',
  invite: FamilyInviteExtended,
};
export default function FamilyInviteFormClient(props: FamilyInviteFormProps) {
  const router = useRouter();
  const invite: FamilyInviteExtended = props.mode === 'edit' ? props.invite : null;
  const families: Family[] | null = props.mode === 'create' ? props.families : null;

  useEffect(() => {
    if (!invite && (!families || families.length === 0))
    router.replace("/family");
  }, [families, invite, props, router]);

  if (!invite && (!families || families.length === 0)) {
    return <div>Redirecting</div>;
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center"
      onClick={() => router.back()}
    >
      <div
        className="rounded-xl bg-white shadow-lg p-6"
        onClick={e => e.stopPropagation()}
      >
        <Form
          className="flex flex-col gap-4"
          action={async (formData) => {
            const familyId = formData.get('familyId')!.toString();
            const disabled = formData.has('disabled');
            const roleType = formData.get('roleType')!.toString() as RoleTypeLimited;
            if (props.mode === 'create') {
              await createInvite(
                disabled,
                familyId,
                roleType,
              );
            } else if (props.mode === 'edit') {
              await updateInvite({
                id: invite!.id,
                disabled,
                roleType,
              });
            }
            router.replace(`/family/${familyId}`);
          }}
        >
          <h3 className="text-lg text-center">{invite ? `invite` : 'Create invite'}</h3>
          <label>
            Family:
            <select name="familyId" defaultValue={invite ? invite.family.id : ""} required>
              {invite ? <option value={invite.family.id}>{invite.family.name}</option>
                : <>
                  <option value="" disabled>-</option>
                  {families!.map(family => (
                    <option key={family.id} value={family.id}>{family.name}</option>
                  ))}
                </>}
            </select>
          </label>
          <label>
            Role:
            <select name="roleType" defaultValue={invite ? invite.roleType : RoleType.USER}>
              {Object.values(RoleType).filter(r => r !== RoleType.ADMIN).map(roleType => (
                <option key={roleType} value={roleType}>{roleType}</option>
              ))}
            </select>
          </label>
          <label>Disabled: <input type="checkbox" name="disabled" defaultChecked={invite ? invite.disabled : false}/></label>
          <button
            className="hover:bg-stone-200 rounded-xl"
            type="submit"
          >
            Submit
          </button>
        </Form>
      </div>
    </div>
  );
}