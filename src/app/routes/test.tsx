import { useSuspenseQuery } from "@apollo/client/react";
import { createFileRoute } from "@tanstack/react-router";
import { GetListsDocument } from "../gql/graphql";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(GetListsDocument);
  return (
    <div>
      <h1>Test Route</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
