"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

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

  return (
    <ModalDialog
      initialFocus={familyNameInputRef as React.RefObject<HTMLElement>}
      onCloseAction={() => router.back()}
    >
      <Form
        className="flex flex-col gap-4"
        action={async (formData) => {
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
          />
        </label>
        <Button type="submit">Submit</Button>
      </Form>
    </ModalDialog>
  );
}
