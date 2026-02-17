import { RoleType } from "@prisma/client";
import { cache } from "react";

import FamilyInviteFormClient from "@/src/app/(protected)/family/[id]/FamilyInviteFormClient";
import FamilyInviteListItem from "@/src/app/(protected)/family/[id]/FamilyInviteListItem";
import FamilyMemberListItem from "@/src/app/(protected)/family/[id]/FamilyMemberListItem";
import LeaveFamilyWidget from "@/src/app/(protected)/family/[id]/LeaveFamilyWidget";
import FamilyMemberFormClient from "@/src/app/(protected)/family/FamilyMemberFormClient";
import AddButton from "@/src/components/ui/buttons/AddButton";
import BackNavigation from "@/src/components/ui/buttons/BackNavigation";
import VerticalList from "@/src/components/ui/list/VerticalList";
import { FamilyExtended, getFamily } from "@/src/db/actions/family";
import { getInvite } from "@/src/db/actions/invite";
import { getMembership } from "@/src/db/actions/membership";
import { getFamilyMemberRole, getAuthorId } from "@/src/db/actions/util";
import { getPageMetadata } from "@/src/lib/metadata";
import { getAllowedRoleTypesForInviteIssuer } from "@/src/lib/utils";

import type { Metadata } from "next";

const getFamilyCached = cache(async (id: string) => {
  return getFamily(id);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const paramsObj = await params;
  const family = await getFamilyCached(paramsObj.id);
  return getPageMetadata({
    title: family ? family.name : "Family - Not Found",
    description: family ? `Family page for ${family.name}` : "Family not found",
  });
}

export default async function FamilyPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ updateMembership: string; inviteEdit: string; issueInvite: boolean }>;
  params: Promise<{ id: string }>;
}) {
  const paramsObj = await params;
  const family: FamilyExtended = await getFamilyCached(paramsObj.id);
  const { updateMembership, inviteEdit, issueInvite } = await searchParams;
  const membership = updateMembership ? await getMembership(updateMembership) : null;

  if (!family) return <div>404 Not Found</div>;

  const currentUserId = await getAuthorId();

  const issuerFamilyRole: RoleType | undefined = await getFamilyMemberRole(family.id);
  if (!issuerFamilyRole) throw new Error("Not a family member");
  const hasAccessToEdit =
    issuerFamilyRole === RoleType.ADMIN || issuerFamilyRole === RoleType.MODERATOR;
  const inviteRoleTypes: RoleType[] = getAllowedRoleTypesForInviteIssuer(issuerFamilyRole);

  return (
    <>
      {/* @TODO: only one popup at the moment */}
      {canIssueInvite(inviteRoleTypes) &&
        membership &&
        isEditableRole(membership.roleType, issuerFamilyRole, inviteRoleTypes) && (
          <FamilyMemberFormClient
            membership={membership}
            onSuccessPath={`/family/${paramsObj.id}`}
            inviteRoleTypes={inviteRoleTypes}
          />
        )}
      {canIssueInvite(inviteRoleTypes) && inviteEdit && (
        <FamilyInviteFormClient
          mode="edit"
          invite={await getInvite(inviteEdit)}
          inviteRoleTypes={inviteRoleTypes}
        />
      )}
      {canIssueInvite(inviteRoleTypes) && issueInvite && (
        <FamilyInviteFormClient
          mode="create"
          families={[family]}
          inviteRoleTypes={inviteRoleTypes}
        />
      )}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <BackNavigation href={"/family"} />
          <div className="text-lg font-semibold mr-auto">{family.name}</div>
          {issuerFamilyRole !== RoleType.ADMIN && (
            <LeaveFamilyWidget familyName={family.name} familyId={family.id} />
          )}
        </div>
        <p className="mt-2">Members:</p>
        <VerticalList>
          {family.memberships.map((membership) => (
            <FamilyMemberListItem
              key={membership.id}
              membership={membership}
              canRemove={
                hasAccessToEdit &&
                isEditableRole(membership.roleType, issuerFamilyRole, inviteRoleTypes) &&
                membership.user.id !== currentUserId
              }
              canEdit={
                hasAccessToEdit &&
                isEditableRole(membership.roleType, issuerFamilyRole, inviteRoleTypes)
              }
            />
          ))}
        </VerticalList>
        <p className="mt-2">Invites:</p>
        {family.familyInvite.length > 0 ? (
          <VerticalList>
            {family.familyInvite.map((familyInvite) => (
              <FamilyInviteListItem
                key={familyInvite.id}
                hasAccessToEdit={hasAccessToEdit}
                familyInvite={familyInvite}
              />
            ))}
          </VerticalList>
        ) : (
          "No invites"
        )}
        {canIssueInvite(inviteRoleTypes) && (
          <AddButton href="?issueInvite=true">Issue invite</AddButton>
        )}
      </div>
    </>
  );
}

function isEditableRole(
  roleTypeToEdit: RoleType,
  issuerFamilyRole: RoleType,
  inviteRoleTypes: RoleType[],
): boolean {
  return (
    issuerFamilyRole !== roleTypeToEdit && inviteRoleTypes.some((role) => role === roleTypeToEdit)
  );
}

function canIssueInvite(inviteRoleTypes: RoleType[]): boolean {
  return inviteRoleTypes.length > 0;
}
