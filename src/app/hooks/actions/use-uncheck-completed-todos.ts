import { UncheckCompletedTodosDocument } from "@/app/gql.gen";
import { readListFromCache } from "@/app/graphql/utils";
import { useApolloClient, useMutation } from "@apollo/client/react";

export default function useUncheckCompletedTodos(listId: string) {
  const { cache } = useApolloClient();

  return useMutation(UncheckCompletedTodosDocument, {
    optimisticResponse: (_variables, { IGNORE }) => {
      const existingList = readListFromCache(cache, listId);
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
  });
}
