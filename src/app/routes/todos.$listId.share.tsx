import { qListShares } from "@/app/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { z } from "astro/zod";
import { Button, Heading, Text } from "@radix-ui/themes";
import ListShares from "../components/list/list-shares";
import { SendIcon } from "lucide-react";
import useAlerts from "../hooks/use-alerts";

export const Route = createFileRoute("/todos/$listId/share")({
  component: RouteComponent,
  validateSearch: z.object({ highlightedTodoId: z.string().optional() }),
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const { data: listShares } = useSuspenseQuery(qListShares(listId));

  const { handleInviteUser } = useAlerts();

  return (
    <React.Fragment>
      <header>
        <Heading as="h2" size="4">
          Users
        </Heading>
        <Text size="2" color="gray">
          Manage users with access to this list. Users with access can view and
          edit todos and share the list with others.
        </Text>
      </header>
      <ListShares listShares={listShares} />
      <footer className="flex">
        <Button
          size="3"
          variant="soft"
          className="flex-1"
          onClick={() => handleInviteUser({ listId })}
        >
          <SendIcon className="size-4" />
          <span>Invite User</span>
        </Button>
      </footer>
    </React.Fragment>
  );
}
