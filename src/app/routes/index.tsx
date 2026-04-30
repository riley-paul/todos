import { createFileRoute } from "@tanstack/react-router";
import NoListsScreen from "../components/screens/no-lists";

export const Route = createFileRoute("/")({
  component: NoListsScreen,
});
