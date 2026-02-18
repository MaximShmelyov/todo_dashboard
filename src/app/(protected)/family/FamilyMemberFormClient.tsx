"use client";

import { RoleType } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

import ModalDialog from "@/src/components/common/ModalDialog";
import ModalDialogTitle from "@/src/components/common/ModalDialogTitle";
import Button from "@/src/components/ui/Button";
import Select from "@/src/components/ui/Select";
import {
  MembershipExtended,
  type RoleTypeLimited,
  updateMembership,
} from "@/src/db/actions/membership";

type FamilyMemberFormProps = {
  membership: MembershipExtended;
  onSuccessPath: string;
  inviteRoleTypes: RoleType[];
};

export default function FamilyMemberFormClient(props: FamilyMemberFormProps) {
  const router = useRouter();
  const { membership, onSuccessPath, inviteRoleTypes } = props;
  const selectRef = useRef<HTMLSelectElement>(null);
  const [loading, setLoading] = useState(false);

  return (
    <ModalDialog
      initialFocus={selectRef as React.RefObject<HTMLElement>}
      onCloseAction={() => router.back()}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const formData = new FormData(e.currentTarget);
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
        <label className="flex flex-col gap-1">
          Role:
          <Select
            name="roleType"
            defaultValue={membership.roleType}
            ref={selectRef}
            disabled={loading}
          >
            {inviteRoleTypes.map((roleType) => (
              <option key={roleType} value={roleType}>
                {roleType}
              </option>
            ))}
          </Select>
        </label>
        <Button type="submit" loading={loading}>
          Submit
        </Button>
      </form>
    </ModalDialog>
  );
}
