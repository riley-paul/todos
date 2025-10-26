import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import { zListName } from "@/lib/types";
import { useAtom } from "jotai";
import { toast } from "sonner";
import useMutations from "../use-mutations";

export default function useCreateListAlert() {
  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const { createList } = useMutations();

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
          createList.mutate({ name });
          dispatchAlert({ type: "close" });
          toast.success(`List "${name}" created`);
        },
      },
    });
  };

  return handleCreateList;
}
