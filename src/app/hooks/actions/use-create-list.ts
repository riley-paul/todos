import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import { zListName } from "@/lib/types";
import { useAtom } from "jotai";
import { GetListsForChipsDocument, useCreateListMutation } from "@/app/gql.gen";
import { useNavigate } from "@tanstack/react-router";

export default function useCreateList() {
  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const navigate = useNavigate();
  const [createList] = useCreateListMutation({
    refetchQueries: [GetListsForChipsDocument],
    onCompleted: ({ createList }) => {
      if (!createList) return;
      navigate({
        to: "/todos/$listId",
        params: { listId: createList.id },
      });
    },
  });

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
          createList({ variables: { input: { name } } });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  return handleCreateList;
}
