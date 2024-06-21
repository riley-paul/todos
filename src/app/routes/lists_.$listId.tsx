import { createFileRoute } from "@tanstack/react-router";
import useListId from "../hooks/use-list-id";

const Component: React.FC = () => {
  const listId = useListId();
  return <div>{listId}</div>;
};

export const Route = createFileRoute("/lists/$listId")({
  component: Component,
});
