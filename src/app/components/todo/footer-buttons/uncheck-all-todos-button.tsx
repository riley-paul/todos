import {
  useGetListSuspenseQuery,
  useUncheckCompletedTodosMutation,
} from "@/app/gql.gen";
import { Button } from "@radix-ui/themes";
import { SquareMinusIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = { listId: string };

const UncheckAllTodosButton: React.FC<Props> = ({ listId }) => {
  const [uncheckCompletedTodos] = useUncheckCompletedTodosMutation({
    onCompleted: () => {
      toast.success("Completed todos unchecked");
    },
  });
  const {
    data: { list },
  } = useGetListSuspenseQuery({ variables: { listId } });
  const todos = list?.todos || [];
  const numCompleted = todos.filter((i) => i.isCompleted).length;

  return (
    <Button
      size="1"
      variant="ghost"
      color="gray"
      onClick={() => uncheckCompletedTodos({ variables: { listId } })}
      disabled={numCompleted === 0}
    >
      <SquareMinusIcon className="size-3" />
      Uncheck
    </Button>
  );
};

export default UncheckAllTodosButton;
