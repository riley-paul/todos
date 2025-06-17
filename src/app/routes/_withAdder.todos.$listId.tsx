import Todos from "@/components/todos";
import { qList } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useDocumentTitle } from "usehooks-ts";

export const Route = createFileRoute("/_withAdder/todos/$listId")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { listId } }) => {
    queryClient.ensureQueryData(qList(listId));
  },
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const {
    data: { name },
  } = useSuspenseQuery(qList(listId));
  useDocumentTitle(name);
  return <Todos listId={listId} />;
}
