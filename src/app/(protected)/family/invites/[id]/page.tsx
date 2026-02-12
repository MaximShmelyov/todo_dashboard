import { getInvitePublic } from "@/src/db/actions/invite";
import { redirect, RedirectType } from "next/navigation";
import FamilyInviteActivate from "@/src/app/(protected)/family/invites/[id]/FamilyInviteActivate";
import { getFamilies } from "@/src/db/actions/family";
import { getPageMetadata } from "@/src/lib/metadata";

export const metadata = getPageMetadata({
  title: "Join family",
});

export default async function InviteActivatePage({ params }: { params: Promise<{ id: string }> }) {
  const paramsObj = await params;
  const { id } = paramsObj;

  const invite = await getInvitePublic(id);
  if (!invite) {
    redirect("/", RedirectType.push);
  }
  const families = await getFamilies();

  return (
    <>
      <FamilyInviteActivate
        invite={invite}
        isMemberAlready={families.some((family) => family.id === invite.familyId)}
      />
    </>
  );
}
