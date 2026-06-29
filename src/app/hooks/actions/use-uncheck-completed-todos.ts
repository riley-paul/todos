import { useUncheckCompletedTodosMutation } from "@/app/gql.gen";
import { readListFromCache } from "@/app/graphql/utils";
import { useApolloClient } from "@apollo/client";
import { toast } from "sonner";

export default function useUncheckCompletedTodos(listId: string) {
  const { cache } = useApolloClient();

  return useUncheckCompletedTodosMutation({
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
    onCompleted: () => {
      toast.success("Completed todos unchecked");
    },
  });
}
