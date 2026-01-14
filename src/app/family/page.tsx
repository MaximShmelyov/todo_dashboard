"use server";

import { getFamilies } from "@/src/db/actions/family";
import AddButton from "@/src/components/ui/buttons/AddButton";
import Card from "@/src/components/ui/Card";
import VerticalList from "@/src/components/ui/list/VerticalList";
import VerticalListItem from "@/src/components/ui/list/VerticalListItem";
import FamilyFormClient from "@/src/app/family/FamilyFormClient";
import { RoleType } from "@prisma/client";
import { getSession } from "@/src/lib/auth";
import PleaseLogIn from "@/src/components/common/PleaseLogIn";
import FamilyMemberFormClient from "@/src/app/family/FamilyMemberFormClient";
import { getMembership } from "@/src/db/actions/membership";
import { getFamilyMemberRole } from "@/src/db/actions/util";
import { getAllowedRoleTypesForInviteIssuer } from "@/src/lib/utils";

export default async function Families({
  searchParams,
}: {
  searchParams: Promise<{ create?: string; /*edit?: string,*/ updateMembership?: string }>;
}) {
  const session = await getSession();

  if (!session || !session.user) {
    return <PleaseLogIn />;
  }

  const families = await getFamilies();
  const params = await searchParams;
  const showCreateForm = params.create === "1";
  const updateMembership = params.updateMembership
    ? await getMembership(params.updateMembership)
    : null;

  const issuerFamilyRole: RoleType | undefined = updateMembership
    ? await getFamilyMemberRole(updateMembership.familyId)
    : undefined;

  return (
    <>
      {updateMembership && updateMembership.roleType !== RoleType.ADMIN && (
        <FamilyMemberFormClient
          membership={updateMembership}
          onSuccessPath={`/family`}
          inviteRoleTypes={getAllowedRoleTypesForInviteIssuer(issuerFamilyRole)}
        />
      )}
      {showCreateForm && <FamilyFormClient />}
      <div className="flex flex-col gap-4">
        {families.map((family) => (
          <Card
            key={family.id}
            title={family.name}
            cardActions={[
              {
                title: "Details",
                href: `family/${family.id}`,
              },
            ]}
          >
            <p>Members:</p>
            <VerticalList>
              {family.memberships.map((membership) => (
                <VerticalListItem
                  key={membership.id}
                  href={
                    getAllowedRoleTypesForInviteIssuer(
                      family.memberships.find((m) => m.user.id === session.user.id)!.roleType,
                    ).some((role) => role === membership.roleType)
                      ? `?updateMembership=${membership.id}`
                      : null
                  }
                >
                  <div>
                    {membership.user.name} : {membership.roleType}
                  </div>
                </VerticalListItem>
              ))}
            </VerticalList>
          </Card>
        ))}
        <AddButton href={"?create=1"}>Create Family</AddButton>
      </div>
    </>
  );
}
