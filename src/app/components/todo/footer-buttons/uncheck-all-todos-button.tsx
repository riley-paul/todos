<<<<<<< HEAD
import {
  useGetListSuspenseQuery,
  useUncheckCompletedTodosMutation,
} from "@/app/gql.gen";
import { Button } from "@radix-ui/themes";
import { SquareMinusIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
=======
import { Button } from "@radix-ui/themes";
import { SquareMinusIcon } from "lucide-react";
import React from "react";
import { qTodos } from "@/app/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import useMutations from "@/app/hooks/use-mutations";
>>>>>>> origin/main

type Props = { listId: string };

const UncheckAllTodosButton: React.FC<Props> = ({ listId }) => {
<<<<<<< HEAD
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
=======
  const { data: numCompleted } = useSuspenseQuery({
    ...qTodos(listId),
    select: (todos) => todos.filter((todo) => todo.isCompleted).length,
  });

  const { uncheckCompletedTodos } = useMutations();
>>>>>>> origin/main

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
