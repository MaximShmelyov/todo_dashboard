'use client'

import {useRouter} from "next/navigation";
import {RoleType} from "@prisma/client";
import Form from "next/form";
import {MembershipExtended, type RoleTypeLimited, updateMembership} from "@/src/db/actions/membership";
import Button from "@/src/components/ui/Button";

type FamilyMemberFormProps = {
  membership: MembershipExtended,
  onSuccessPath: string,
  inviteRoleTypes: RoleType[],
};

export default function FamilyMemberFormClient(props: FamilyMemberFormProps) {
  const router = useRouter();
  const {membership, onSuccessPath, inviteRoleTypes} = props;

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
            await updateMembership(
              {
                id: membership.id,
                roleType: formData.get('roleType')!.toString() as RoleTypeLimited
              });
            router.replace(onSuccessPath);
          }}
        >
          <h3 className="text-lg text-center">{membership.user.name} in {membership.family.name}</h3>
          <label>Role:
            <select
              className="ml-1 hover:bg-stone-100"
              name="roleType" defaultValue={membership.roleType}
            >
              {inviteRoleTypes.map(roleType => (
                <option
                  key={roleType}
                  value={roleType}
                >
                  {roleType}
                </option>
              ))}
            </select>
          </label>
          <Button
            type="submit"
          >
            Submit
          </Button>
        </Form>
      </div>

    </div>
  );
}