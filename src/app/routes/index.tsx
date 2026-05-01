import { createFileRoute, Navigate } from "@tanstack/react-router";
import NoListsScreen from "../components/screens/no-lists";
import useGetLists from "../hooks/actions/use-get-lists";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [firstList] = useGetLists();

  if (!firstList) return <NoListsScreen />;
  return (
    <Navigate to="/todos/$listId" params={{ listId: firstList.id }} replace />
  );
}
