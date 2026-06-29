import { useCreateTodoMutation, useGetMeSuspenseQuery } from "@/app/gql.gen";
import { readListFromCache } from "@/app/graphql/utils";
import { useApolloClient } from "@apollo/client";

export default function useCreateTodo(listId: string) {
  const { cache } = useApolloClient();
  const {
    data: { me },
  } = useGetMeSuspenseQuery();

  return useCreateTodoMutation({
    optimisticResponse: ({ input: { text } }, { IGNORE }) => {
      const existingList = readListFromCache(cache, listId);
      if (!existingList) return IGNORE;

      return {
        __typename: "Mutation",
        createTodo: {
          ...existingList,
          todoCount: existingList.todoCount + 1,
          todos: [
            {
              __typename: "TodoObjectType",
              id: `temp-id-${Math.random()}`,
              text,
              isCompleted: false,
              isAuthor: true,
              author: me,
              list: existingList,
            },
            ...existingList.todos,
          ],
        },
      };
    },
  });
}
