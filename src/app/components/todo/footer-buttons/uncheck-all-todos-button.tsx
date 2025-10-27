import useMutations from "@/app/hooks/use-mutations";
import { qTodos } from "@/lib/client/queries";
import { Button } from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SquareMinusIcon } from "lucide-react";
import React from "react";

type Props = { listId: string };

const UncheckAllTodosButton: React.FC<Props> = ({ listId }) => {
  const { uncheckCompletedTodos } = useMutations();
  const { data: todos } = useSuspenseQuery(qTodos(listId));
  const numCompleted = todos.filter((i) => i.isCompleted).length;

  return (
    <Button
      size="1"
      variant="ghost"
      color="gray"
      onClick={() => uncheckCompletedTodos.mutate({ listId })}
      disabled={numCompleted === 0}
    >
      <SquareMinusIcon className="size-3" />
      Uncheck
    </Button>
  );
};

export default UncheckAllTodosButton;
