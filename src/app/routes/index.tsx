import { qLists } from "@/lib/client/queries";
import { createFileRoute, redirect } from "@tanstack/react-router";
import NoListsScreen from "../components/screens/no-lists";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    const lists = await queryClient.ensureQueryData(qLists);
    if (lists.length >= 1) {
      throw redirect({
        to: "/todos/$listId",
        params: { listId: lists[0].id },
      });
    }
    return { lists };
  },
});

function RouteComponent() {
  return <NoListsScreen />;
}
