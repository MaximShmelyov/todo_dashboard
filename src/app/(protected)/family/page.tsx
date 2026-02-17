import { getFamilies } from "@/src/db/actions/family";
import AddButton from "@/src/components/ui/buttons/AddButton";
import Card from "@/src/components/ui/Card";
import VerticalList from "@/src/components/ui/list/VerticalList";
import FamilyMemberListItem from "@/src/app/(protected)/family/[id]/FamilyMemberListItem";
import FamilyFormClient from "@/src/app/(protected)/family/FamilyFormClient";
import { getSession } from "@/src/lib/auth";
import PleaseLogIn from "@/src/components/common/PleaseLogIn";
import { getPageMetadata } from "@/src/lib/metadata";

export const metadata = getPageMetadata({
  title: "Families",
});

export default async function Families({
  searchParams,
}: {
  searchParams: Promise<{ create?: string; updateMembership?: string }>;
}) {
  const session = await getSession();

  if (!session || !session.user) {
    return <PleaseLogIn />;
  }

  const families = await getFamilies();
  const params = await searchParams;
  const showCreateForm = params.create === "1";

  return (
    <>
      {showCreateForm && <FamilyFormClient />}
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="flex items-center mb-2">
          <h1 className="text-2xl font-bold mr-auto">Your families</h1>
          <AddButton href="?create=1">Create Family</AddButton>
        </div>
        {families.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            You are not a member of any family yet.
          </div>
        )}
        <div className="flex flex-col gap-6">
          {families.map((family) => (
            <Card
              key={family.id}
              title={
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">{family.name}</span>
                </div>
              }
              cardActions={[
                {
                  title: "Details",
                  href: `family/${family.id}`,
                },
              ]}
            >
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Members:</div>
                <VerticalList>
                  {family.memberships.map((membership) => (
                    <FamilyMemberListItem
                      key={membership.id}
                      membership={membership}
                      canEdit={false}
                      canRemove={false}
                    />
                  ))}
                </VerticalList>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
