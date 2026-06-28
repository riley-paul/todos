import {
  ListFullFragmentDoc,
  useDeleteCompletedTodosMutation,
  type ListFullFragment,
} from "@/app/gql.gen";
import { useApolloClient } from "@apollo/client";
import { toast } from "sonner";

export default function useDeleteCompletedTodos(listId: string) {
  const { cache } = useApolloClient();

  return useDeleteCompletedTodosMutation({
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
        deleteCompletedTodos: {
          ...existingList,
          todos: existingList.todos.filter((todo) => !todo.isCompleted),
        },
      };
    },
    onCompleted: () => {
      toast.success("Completed todos deleted");
    },
  });
}
