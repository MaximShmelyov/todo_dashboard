'use server'

import Card from "@/src/components/ui/Card";
import {getFeedCollections} from "@/src/db/actions/feed/feedCollections";
import {getCategoryLabelOfCollectionType, getCollectionRoute} from "@/src/lib/utils";
import VerticalList from "@/src/components/ui/list/VerticalList";
import VerticalListItem from "@/src/components/ui/list/VerticalListItem";
import {getSession} from "@/src/lib/auth";
import PleaseLogIn from "@/src/components/common/PleaseLogIn";

export default async function Home() {
  const session = await getSession();
  if (!session || !session.user) {
    return <PleaseLogIn/>;
  }

  const feeds = await getFeedCollections();

  return (
    <div className="space-y-8">

      <h2 className="text-2xl font-semibold tracking-tight">
        Recent
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(feeds).map(([type, collections]) => (
          <Card
            key={type}
            title={getCategoryLabelOfCollectionType(type)}>
            {collections.length > 0 ? <VerticalList>
              {collections.map(collection => (
                <VerticalListItem
                  key={collection.id}
                  href={`${getCollectionRoute(type)}/${collection.id}`}>
                  <div>{collection.title}</div>
                </VerticalListItem>
              ))}
            </VerticalList> : 'No recent items'}
            <a className="block mt-2 underline" href={getCollectionRoute(type)}>See all items -&gt;</a>
          </Card>
        ))}
      </div>
    </div>
  );
}
