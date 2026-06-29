import { DeleteCompletedTodosDocument } from "@/app/gql.gen";
import { readListFromCache } from "@/app/graphql/utils";
import { useApolloClient, useMutation } from "@apollo/client/react";

export default function useDeleteCompletedTodos(listId: string) {
  const { cache } = useApolloClient();

  return useMutation(DeleteCompletedTodosDocument, {
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
  });
}
