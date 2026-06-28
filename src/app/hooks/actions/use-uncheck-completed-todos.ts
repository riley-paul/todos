import {
  ListFullFragmentDoc,
  useUncheckCompletedTodosMutation,
  type ListFullFragment,
} from "@/app/gql.gen";
import { useApolloClient } from "@apollo/client";
import { toast } from "sonner";

export default function useUncheckCompletedTodos(listId: string) {
  const { cache } = useApolloClient();

  return useUncheckCompletedTodosMutation({
    optimisticResponse: (_variables, { IGNORE }) => {
      const listCacheId = cache.identify({
        __typename: "ListObjectType",
        id: listId,
      });
      const existingList = cache.readFragment<ListFullFragment>({
        id: listCacheId,
        fragmentName: "ListFull",
        fragment: ListFullFragmentDoc,
      });
      if (!existingList) return IGNORE;

      return {
        __typename: "Mutation",
        uncheckCompletedTodos: {
          ...existingList,
          todoCount: existingList.todos.length,
          todos: existingList.todos.map((todo) => ({
            ...todo,
            isCompleted: false,
          })),
        },
      };
    },
    onCompleted: () => {
      toast.success("Completed todos unchecked");
    },
  });
}
