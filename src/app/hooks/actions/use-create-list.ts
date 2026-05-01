import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import { zListName } from "@/lib/types";
import { useAtom } from "jotai";
import * as collections from "@/app/lib/collections";
import { mutationCache, queryClient } from "@/app/lib/query-client";
import { actions } from "astro:actions";
import { useNavigate } from "@tanstack/react-router";

const createListMutation = mutationCache.build(queryClient, {
  mutationFn: actions.lists.create.orThrow,
  onSuccess: () => {
    collections.lists.utils.refetch();
    collections.listUsers.utils.refetch();
  },
});

export default function useCreateList() {
  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const navigate = useNavigate();

  const handleCreateList = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Create New List",
        message: "Enter a name for your new list",
        value: "",
        placeholder: "List name",
        schema: zListName,
        handleSubmit: async (name: string) => {
          const newList = await createListMutation.execute({ name });
          dispatchAlert({ type: "close" });
          navigate({ to: "/todos/$listId", params: { listId: newList.id } });
        },
      },
    });
  };

  return handleCreateList;
}
