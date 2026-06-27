import { createFileRoute, redirect } from "@tanstack/react-router";
import NoListsScreen from "../components/screens/no-lists";
<<<<<<< HEAD
import {
  GetListsForChipsDocument,
  type GetListsForChipsQuery,
  type GetListsForChipsQueryVariables,
} from "@/app/gql.gen";

export const Route = createFileRoute("/")({
  component: NoListsScreen,
  loader: async ({ context: { apolloClient } }) => {
    const {
      data: {
        lists: [firstList],
      },
    } = await apolloClient.query<
      GetListsForChipsQuery,
      GetListsForChipsQueryVariables
    >({
      query: GetListsForChipsDocument,
    });

=======
import { qLists } from "../lib/queries";

export const Route = createFileRoute("/")({
  component: NoListsScreen,
  loader: async ({ context: { queryClient } }) => {
    const [firstList] = await queryClient.ensureQueryData(qLists());
>>>>>>> origin/main
    if (firstList) {
      throw redirect({
        to: "/todos/$listId",
        params: { listId: firstList.id },
      });
    }
  },
});
