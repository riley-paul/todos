import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import { zListName } from "@/lib/types";
import { useAtom } from "jotai";
import { CreateListDocument, GetListsForChipsDocument } from "@/app/gql.gen";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useMutation } from "@apollo/client/react";

export default function useCreateList() {
  const navigate = useNavigate();
  const router = useRouter();

  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const [createList] = useMutation(CreateListDocument, {
    refetchQueries: [GetListsForChipsDocument],
    onCompleted: ({ createList }) => {
      if (!createList) return;
      router.invalidate();
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
