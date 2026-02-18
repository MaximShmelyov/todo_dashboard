"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

import ModalDialog from "@/src/components/common/ModalDialog";
import ModalDialogTitle from "@/src/components/common/ModalDialogTitle";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { createFamily, updateFamily } from "@/src/db/actions/family";

export default function FamilyFormClient({
  family,
}: {
  family?: [familyId: string, familyName: string];
}) {
  const router = useRouter();
  const familyNameInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  return (
    <ModalDialog
      initialFocus={familyNameInputRef as React.RefObject<HTMLElement>}
      onCloseAction={() => router.back()}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const formData = new FormData(e.currentTarget);
          const name = formData.get("familyName")!.toString();
          if (family) {
            await updateFamily({
              id: family[0],
              name,
            });
          } else {
            await createFamily(name);
          }
          router.push("/family");
        }}
      >
        <ModalDialogTitle>{family ? "Update" : "Create"}</ModalDialogTitle>
        <label className="flex flex-col gap-1">
          <span className="flex items-center gap-1">
            Family name <span className="text-red-500">*</span>
          </span>
          <Input
            name="familyName"
            maxLength={25}
            defaultValue={family ? family[1] : ""}
            placeholder="Enter family name"
            required
            aria-required="true"
            ref={familyNameInputRef}
            disabled={loading}
          />
        </label>
        <Button type="submit" loading={loading}>
          Submit
        </Button>
      </form>
    </ModalDialog>
  );
}
