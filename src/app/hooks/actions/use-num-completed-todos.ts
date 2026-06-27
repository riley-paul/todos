import { useGetListSuspenseQuery } from "@/app/gql.gen";

export default function useNumCompletedTodos(listId: string) {
  const {
    data: { list },
  } = useGetListSuspenseQuery({ variables: { listId } });
  const todos = list?.todos || [];
  return todos.filter((i) => i.isCompleted).length;
}
