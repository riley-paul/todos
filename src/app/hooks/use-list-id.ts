import { useParams } from "@tanstack/react-router";

export default function useListId(): string {
  const params = useParams({ strict: false });
  if ("listId" in params && params.listId) return params.listId;
  return "";
}
