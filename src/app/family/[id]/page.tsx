'use server'

import {FamilyExtended, getFamily} from "@/src/db/actions/family";
import BackNavigation from "@/src/components/ui/buttons/BackNavigation";
import VerticalList from "@/src/components/ui/list/VerticalList";
import VerticalListItem from "@/src/components/ui/list/VerticalListItem";
import {RoleType} from "@prisma/client";
import {getMembership} from "@/src/db/actions/membership";
import FamilyMemberFormClient from "@/src/app/family/FamilyMemberFormClient";
import FamilyInviteFormClient from "@/src/app/family/[id]/FamilyInviteFormClient";
import {getInvite} from "@/src/db/actions/invite";
import AddButton from "@/src/components/ui/buttons/AddButton";
import {getFamilyMemberRole} from "@/src/db/actions/util";
import {getAllowedRoleTypesForInviteIssuer} from "@/src/lib/utils";
import FamilyInviteListItem from "@/src/app/family/[id]/FamilyInviteListItem";

export default async function FamilyPage({searchParams, params}: {
  searchParams: Promise<{ updateMembership: string, inviteEdit: string, issueInvite: boolean }>,
  params: Promise<{ id: string }>
}) {
  const paramsObj = await params;
  const family: FamilyExtended = await getFamily(paramsObj.id);
  const {updateMembership, inviteEdit, issueInvite} = await searchParams;
  const membership = updateMembership ? await getMembership(updateMembership) : null;

  if (!family) return <div>404 Not Found</div>;

  const issuerFamilyRole: RoleType | undefined = await getFamilyMemberRole(family.id);
  if (!issuerFamilyRole) throw new Error('Not a family member');
  const hasAccessToEdit = issuerFamilyRole === RoleType.ADMIN;
  const inviteRoleTypes: RoleType[] = getAllowedRoleTypesForInviteIssuer(issuerFamilyRole);

  return (
    <>
      {/* @TODO: only one popup at the moment */}
      {canIssueInvite(inviteRoleTypes) && membership && isEditableRole(membership.roleType, issuerFamilyRole, inviteRoleTypes) &&
        <FamilyMemberFormClient membership={membership} onSuccessPath={`/family/${paramsObj.id}`} inviteRoleTypes={inviteRoleTypes}/>}
      {canIssueInvite(inviteRoleTypes) && inviteEdit && <FamilyInviteFormClient mode="edit" invite={await getInvite(inviteEdit)} inviteRoleTypes={inviteRoleTypes}/>}
      {canIssueInvite(inviteRoleTypes) && issueInvite && <FamilyInviteFormClient mode="create" families={[family]} inviteRoleTypes={inviteRoleTypes}/>}
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
              href={(/*hasAccessToEdit && */isEditableRole(membership.roleType, issuerFamilyRole, inviteRoleTypes)) ? `?updateMembership=${membership.id}` : ''}
            >
              <div>{membership.user.name} : {membership.roleType}</div>
            </VerticalListItem>
          ))}
        </VerticalList>
        <p className="mt-2">Invites:</p>
        {family.familyInvite.length > 0 ? <VerticalList>
          {family.familyInvite.map(familyInvite => (
            <FamilyInviteListItem key={familyInvite.id} hasAccessToEdit={hasAccessToEdit} familyInvite={familyInvite}/>
          ))}
        </VerticalList> : 'No invites'}
        {canIssueInvite(inviteRoleTypes) && <AddButton href="?issueInvite=true">
          Issue invite
        </AddButton>}
      </div>
    </>
  );
}

function isEditableRole(roleTypeToEdit: RoleType, issuerFamilyRole: RoleType, inviteRoleTypes: RoleType[]): boolean {
  return issuerFamilyRole !== roleTypeToEdit && inviteRoleTypes.some(role => role === roleTypeToEdit);
}

function canIssueInvite(inviteRoleTypes: RoleType[]): boolean {
  return inviteRoleTypes.length > 0;
}