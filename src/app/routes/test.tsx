import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});



function RouteComponent() {
  const { data: lists } = useQuery(GET_LISTS);
  return (
    <div>
      <h1>Test Route</h1>
      <pre>{JSON.stringify(lists, null, 2)}</pre>
    </div>
  );
}
