import { useDeleteCompletedTodosMutation } from "@/app/gql.gen";
import { readListFromCache } from "@/app/graphql/utils";
import { useApolloClient } from "@apollo/client";
import { toast } from "sonner";

export default function useDeleteCompletedTodos(listId: string) {
  const { cache } = useApolloClient();

  return useDeleteCompletedTodosMutation({
    optimisticResponse: (_variables, { IGNORE }) => {
      const existingList = readListFromCache(cache, listId);
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
