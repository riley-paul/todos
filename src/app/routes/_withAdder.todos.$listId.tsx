import Todos from "@/app/components/todo/todos";
import useMutations from "@/app/hooks/use-mutations";
import { qList, qTodos } from "@/lib/client/queries";
import { Button, Text } from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useDocumentTitle } from "usehooks-ts";

export const Route = createFileRoute("/_withAdder/todos/$listId")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { listId } }) =>
    Promise.all([
      queryClient.ensureQueryData(qTodos(listId)),
      queryClient.ensureQueryData(qList(listId)),
    ]),
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const { data: list } = useSuspenseQuery(qList(listId));

  const { acceptListJoin, leaveList } = useMutations();

  useDocumentTitle(list.name);

  if (list.isPending) {
    return (
      <div className="flex h-full min-h-52 flex-col items-center justify-center gap-4">
        <header className="flex flex-col items-center gap-2">
          <Text size="3" weight="bold">
            You have been invited to join {list.name}
          </Text>
          <Text size="2" color="gray">
            Do you want to join this list?
          </Text>
        </header>
        <div className="grid min-w-52 grid-cols-2 gap-2">
          <Button
            variant="soft"
            color="red"
            size="2"
            onClick={() => leaveList.mutate({ listId })}
          >
            No
          </Button>
          <Button
            variant="solid"
            color="green"
            size="2"
            onClick={() => acceptListJoin.mutate({ listId })}
          >
            Yes
          </Button>
        </div>
      </div>
    );
  }

  return <Todos listId={listId} list={list} />;
}
