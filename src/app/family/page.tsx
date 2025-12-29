'use server'

import {getFamilies} from "@/src/db/actions/family";
import AddButton from "@/src/components/ui/buttons/AddButton";
import Card from "@/src/components/ui/Card";
import VerticalList from "@/src/components/ui/list/VerticalList";
import VerticalListItem from "@/src/components/ui/list/VerticalListItem";
import FamilyFormClient from "@/src/app/family/FamilyFormClient";
import {Family} from "@prisma/client";
import {getSession} from "@/src/lib/auth";
import PleaseLogIn from "@/src/components/common/PleaseLogIn";

function getFamily(families: Family[], id: Family['id']): [string, string] {
  const family = families.find(family => family.id === id);
  if (!family) return ["", ""];
  return [family.id, family.name];
}

export default async function Family({searchParams}: {
  searchParams: Promise<{ create?: string, edit?: string }>
}) {
  const session = await getSession();

  if (!session || !session.user) {
    return <PleaseLogIn/>;
  }

  const families = await getFamilies();
  const params = await searchParams;
  const showCreateForm = params.create === "1";
  const familyToEdit = params.edit ? getFamily(families, params.edit) : null;

  return (
    <>
      {showCreateForm && <FamilyFormClient/>}
      {familyToEdit && <FamilyFormClient family={familyToEdit}/>}
      <div className="flex flex-col gap-4">
        {families.map(family => (
            <Card key={family.id}
                  title={family.name}
                  cardActions={[
                    {
                      title: 'Edit',
                      href: `?edit=${family.id}`,
                    }
                  ]}
            >
              <p>Members:</p>
              <VerticalList>
                {family.memberships.map(membership => (
                  <VerticalListItem
                    key={membership.id}
                    href={""}
                  >
                    <div>{membership.user.name} : {membership.roleType}</div>
                  </VerticalListItem>
                ))}
              </VerticalList>
            </Card>
          )
        )}
        <AddButton href={'?create=1'}>
          Create Family
        </AddButton>
      </div>
    </>
  )
    ;
}