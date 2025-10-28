import { qList } from "@/app/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import React from "react";
import { z } from "astro/zod";
import { Button, Heading, Text } from "@radix-ui/themes";
import ListSharing from "../components/list/list-sharing";
import { CheckIcon } from "lucide-react";
import BackButton from "../components/ui/back-button";

export const Route = createFileRoute("/todos/$listId/share")({
  component: RouteComponent,
  validateSearch: z.object({ highlightedTodoId: z.string().optional() }),
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const { data: list } = useSuspenseQuery(qList(listId));

  if (!list) return <Navigate to="/" />;

  return (
    <React.Fragment>
      <header className="flex gap-3">
        <BackButton className="hidden sm:flex" />
        <section>
          <Heading as="h2" size="4">
            Share List
          </Heading>
          <Text size="2" color="gray">
            Add other users to your list so they can add and delete todos. Their
            invite will be pending until they accept it.
          </Text>
        </section>
      </header>
      <ListSharing list={list} />
      <footer className="flex justify-end sm:hidden">
        <Button size="3" variant="soft" className="flex-1" asChild>
          <Link to="/todos/$listId" params={{ listId: list.id }}>
            <CheckIcon className="size-4" />
            Done
          </Link>
        </Button>
      </footer>
    </React.Fragment>
  );
}
