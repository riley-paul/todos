import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import { zListName } from "@/lib/types";
import { useAtom } from "jotai";
import * as collections from "@/app/lib/collections";
import type { ListSelect } from "@/lib/types";
import { useUser } from "@/app/providers/user-provider";

export default function useCreateList() {
  const currentUser = useUser();
  const [, dispatchAlert] = useAtom(alertSystemAtom);

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
        handleSubmit: (name: string) => {
          const list: ListSelect = {
            id: crypto.randomUUID(),
            name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          collections.fns.insertList({ list, userId: currentUser.id });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  return handleCreateList;
}
