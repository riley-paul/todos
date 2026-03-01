import { createFileRoute, redirect } from "@tanstack/react-router";
import NoListsScreen from "../components/screens/no-lists";
import { listCollection } from "../lib/collections";

export const Route = createFileRoute("/")({
  component: NoListsScreen,
  // loader: async () => {
  //   const state = await listCollection.stateWhenReady()
  //   if (state.size > 0) {
      
  //   }
  //   const [firstList] = await queryClient.ensureQueryData(qLists);
  //   if (firstList) {
  //     throw redirect({
  //       to: "/todos/$listId",
  //       params: { listId: firstList.id },
  //     });
  //   }
  // },
});
