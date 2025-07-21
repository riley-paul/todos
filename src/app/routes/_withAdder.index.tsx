import Todos from "@/components/todo/todos";
import { qTodos } from "@/lib/client/queries";
import { createFileRoute } from "@tanstack/react-router";
import { ChannelProvider } from "ably/react";
import { useDocumentTitle } from "usehooks-ts";

export const Route = createFileRoute("/_withAdder/")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(qTodos(null));
  },
});

function RouteComponent() {
  useDocumentTitle("Inbox");
  return (
    <ChannelProvider channelName={`list:inbox`}>
      <Todos listId={null} />;
    </ChannelProvider>
  );
}
