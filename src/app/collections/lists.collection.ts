import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryClient } from "@/app/lib/query-client";
import { actions } from "astro:actions";

const listsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["lists"],
    queryFn: actions.lists2.populate.orThrow,
    getKey: (list) => list.id,
  }),
);

export default listsCollection;
