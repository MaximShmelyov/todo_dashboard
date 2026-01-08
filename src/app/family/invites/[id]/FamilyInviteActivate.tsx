'use client'

import {activateInvite, FamilyInvitePublic} from "@/src/db/actions/invite";
import {useRouter} from "next/navigation";

export default function FamilyInviteActivate({invite, isMemberAlready}: {
  readonly invite: NonNullable<FamilyInvitePublic>,
  readonly isMemberAlready: boolean
}) {
  const router = useRouter();
  const handleActivateInvite = async () => {
    if (await activateInvite(invite.id)) {
      router.push(`/family/${invite.familyId}`);
    } else {
      router.push("/family");
    }
    return <>Redirecting...</>;
  };
  const handleCancel = () => {
    if (isMemberAlready) {
      router.push(`/family/${invite.familyId}`);
    } else {
      router.push('/family');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!isMemberAlready && <>
        <h3 className="text-lg text-center">Do you want to join <span
          className="font-semibold">{`'${invite.family.name}'`}</span> family?</h3>
        <div className="flex flex-row gap-8 w-full justify-center">
          <button
            className="bg-green-100 hover:bg-green-200 font-semibold px-2 rounded-lg"
            onClick={handleActivateInvite}
          >
            Join {`'${invite.family.name}'`}
          </button>
          <button
            className="bg-stone-100 hover:bg-stone-200 px-2 rounded-lg"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </>}
      {isMemberAlready && <>
        <h3 className="text-lg text-center">Sorry, you are a family member already.</h3>
        <button
          className="bg-stone-100 hover:bg-stone-200 px-2 rounded-lg"
          onClick={handleCancel}
        >
          Go to the family page
        </button>
      </>}
    </div>
  );
}