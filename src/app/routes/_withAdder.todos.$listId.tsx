import Todos from "@/components/todo/todos";
import { qList } from "@/lib/client/queries";
import { createFileRoute } from "@tanstack/react-router";
import { useDocumentTitle } from "usehooks-ts";

export const Route = createFileRoute("/_withAdder/todos/$listId")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { listId } }) => {
    const list = await queryClient.ensureQueryData(qList(listId));
    return { list };
  },
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const { list } = Route.useLoaderData();

  useDocumentTitle(list.name);

  return <Todos listId={listId} />;
}
