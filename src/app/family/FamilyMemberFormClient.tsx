"use client";

import { useRouter } from "next/navigation";
import { RoleType } from "@prisma/client";
import Form from "next/form";
import {
  MembershipExtended,
  type RoleTypeLimited,
  updateMembership,
} from "@/src/db/actions/membership";
import Button from "@/src/components/ui/Button";
import ModalDialog from "@/src/components/common/ModalDialog";
import ModalDialogTitle from "@/src/components/common/ModalDialogTitle";

type FamilyMemberFormProps = {
  membership: MembershipExtended;
  onSuccessPath: string;
  inviteRoleTypes: RoleType[];
};

export default function FamilyMemberFormClient(props: FamilyMemberFormProps) {
  const router = useRouter();
  const { membership, onSuccessPath, inviteRoleTypes } = props;

  return (
    <ModalDialog onCloseAction={() => router.back()}>
      <Form
        className="flex flex-col gap-4"
        action={async (formData) => {
          await updateMembership({
            id: membership.id,
            roleType: formData.get("roleType")!.toString() as RoleTypeLimited,
          });
          router.replace(onSuccessPath);
        }}
      >
        <ModalDialogTitle>
          {membership.user.name} in {membership.family.name}
        </ModalDialogTitle>
        <label>
          Role:
          <select
            className="ml-1 hover:bg-stone-100"
            name="roleType"
            defaultValue={membership.roleType}
          >
            {inviteRoleTypes.map((roleType) => (
              <option key={roleType} value={roleType}>
                {roleType}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit">Submit</Button>
      </Form>
    </ModalDialog>
  );
}
