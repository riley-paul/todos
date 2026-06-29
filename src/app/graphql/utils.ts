import type { ApolloCache } from "@apollo/client";
import { ListFullFragmentDoc, type ListFullFragment } from "../gql.gen";

export const readListFromCache = (
  cache: ApolloCache<object>,
  listId: string,
) => {
  const listCacheId = cache.identify({
    __typename: "ListObjectType",
    id: listId,
  });
  return cache.readFragment<ListFullFragment>({
    id: listCacheId,
    fragmentName: "ListFull",
    fragment: ListFullFragmentDoc,
    optimistic: true,
  });
};
