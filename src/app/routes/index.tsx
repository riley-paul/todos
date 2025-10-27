import { qLists, qUser } from "@/app/lib/queries";
import { createFileRoute, redirect } from "@tanstack/react-router";
import NoListsScreen from "../components/screens/no-lists";
import { sortByOrder } from "../lib/utils";

export const Route = createFileRoute("/")({
  component: NoListsScreen,
  loader: async ({ context: { queryClient } }) => {
    const lists = await queryClient.ensureQueryData(qLists);

    if (lists.length >= 1) {
      const currentUser = await queryClient.ensureQueryData(qUser);
      const [firstList] = sortByOrder(lists, currentUser.settingListOrder);
      throw redirect({
        to: "/todos/$listId",
        params: { listId: firstList.id },
      });
    }

    return { lists };
  },
});
