import { qLists } from "@/app/lib/queries";
import { createFileRoute, redirect } from "@tanstack/react-router";
import NoListsScreen from "../components/screens/no-lists";

export const Route = createFileRoute("/")({
  component: NoListsScreen,
  loader: async ({ context: { queryClient } }) => {
    const [firstList] = await queryClient.ensureQueryData(qLists);
    if (firstList) {
      throw redirect({
        to: "/todos/$listId",
        params: { listId: firstList.id },
      });
    }
  },
});
