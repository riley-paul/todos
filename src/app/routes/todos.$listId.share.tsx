import { qListShares } from "@/app/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import React from "react";
import { z } from "astro/zod";
import { Button, Heading, Text } from "@radix-ui/themes";
import ListShares from "../components/list/list-shares";
import { CheckIcon } from "lucide-react";
import ListUserInviter from "../components/list/list-inviter";

export const Route = createFileRoute("/todos/$listId/share")({
  component: RouteComponent,
  validateSearch: z.object({ highlightedTodoId: z.string().optional() }),
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const { data: listShares } = useSuspenseQuery(qListShares(listId));

  const existingUserIds = new Set(listShares.map(({ userId }) => userId));

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
      <ListUserInviter
        listId={listId}
        isUserDisabled={(userId) => existingUserIds.has(userId)}
      />
      <ListShares listShares={listShares} />
      <footer className="flex justify-end gap-2">
        <Button
          size="3"
          variant="surface"
          className="flex-1 sm:flex-0 sm:px-8"
          asChild
        >
          <Link to="..">
            <CheckIcon className="size-4" />
            Done
          </Link>
        </Button>
      </footer>
    </React.Fragment>
  );
}
