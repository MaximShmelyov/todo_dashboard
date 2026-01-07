'use server'

import {getFamily} from "@/src/db/actions/family";
import BackNavigation from "@/src/components/ui/buttons/BackNavigation";
import VerticalList from "@/src/components/ui/list/VerticalList";
import VerticalListItem from "@/src/components/ui/list/VerticalListItem";
import {RoleType} from "@prisma/client";
import {getMembership} from "@/src/db/actions/membership";
import FamilyMemberFormClient from "@/src/app/family/FamilyMemberFormClient";
import FamilyInviteFormClient from "@/src/app/family/[id]/FamilyInviteFormClient";
import {getInvite} from "@/src/db/actions/invite";
import AddButton from "@/src/components/ui/buttons/AddButton";

export default async function FamilyPage({searchParams, params}: {
  searchParams: Promise<{ updateMembership: string, inviteEdit: string, issueInvite: boolean }>,
  params: Promise<{ id: string }>
}) {
  const paramsObj = await params;
  const family = await getFamily(paramsObj.id);
  const {updateMembership, inviteEdit, issueInvite} = await searchParams;
  const membership = updateMembership ? await getMembership(updateMembership) : null;

  if (!family) return <div>404 Not Found</div>;

  return (
    <>
      {/* @TODO: only one popup at the moment */}
      {membership && membership.roleType !== RoleType.ADMIN &&
        <FamilyMemberFormClient membership={membership} onSuccessPath={`/family/${paramsObj.id}`}/>}
      {inviteEdit && <FamilyInviteFormClient mode="edit" invite={await getInvite(inviteEdit)}/>}
      {issueInvite && <FamilyInviteFormClient mode="create" families={[family]}/>}
      <div
        className="flex flex-col gap-2"
      >
        <div className="flex flex-row items-center justify-between">
          <BackNavigation href={"/family"}/>
          <div className="text-lg font-semibold mr-auto">{family.name}</div>
        </div>
        <p className="mt-2">Members:</p>
        <VerticalList>
          {family.memberships.map(membership => (
            <VerticalListItem
              key={membership.id}
              href={membership.roleType !== RoleType.ADMIN ? `?updateMembership=${membership.id}` : ''}
            >
              <div>{membership.user.name} : {membership.roleType}</div>
            </VerticalListItem>
          ))}
        </VerticalList>
        <p className="mt-2">Invites:</p>
        {family.familyInvite.length > 0 ? <VerticalList>
          {family.familyInvite.map(familyInvite => (
            <VerticalListItem
              key={familyInvite.id}
              href={`?inviteEdit=${familyInvite.id}`}
            >
              <div
                className={familyInvite.disabled ? 'bg-red-50' : ''}
              >
                {familyInvite.roleType} - <span
                className="font-semibold">{familyInvite.usedBy?.email ?? 'Available'}</span> created
                at {familyInvite.createdAt.toLocaleString()}{familyInvite.disabled ? <span> - disabled</span> : <></>}
              </div>
            </VerticalListItem>
          ))}
        </VerticalList> : 'No invites'}
        <AddButton href="?issueInvite=true">
          Issue invite
        </AddButton>
      </div>
    </>
  );
}