import { GetListDocument } from "@/app/gql.gen";
import { useSuspenseQuery } from "@apollo/client/react";

export default function useNumCompletedTodos(listId: string) {
  const {
    data: { list },
  } = useSuspenseQuery(GetListDocument, { variables: { listId } });
  const todos = list?.todos || [];
  return todos.filter((i) => i.isCompleted).length;
}
