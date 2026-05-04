import { Button } from "@radix-ui/themes";
import { SquareMinusIcon } from "lucide-react";
import React from "react";
import * as collections from "@/app/lib/collections";
import { qTodosForList } from "@/app/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";

type Props = { listId: string };

const UncheckAllTodosButton: React.FC<Props> = ({ listId }) => {
  const { data: numCompleted } = useSuspenseQuery({
    ...qTodosForList(listId),
    select: (todos) => todos.filter((todo) => todo.isCompleted).length,
  });

  return (
    <Button
      size="1"
      variant="ghost"
      color="gray"
      onClick={() => collections.fns.uncheckCompletedTodos({ listId })}
      disabled={numCompleted === 0}
    >
      <SquareMinusIcon className="size-3" />
      Uncheck
    </Button>
  );
};

export default UncheckAllTodosButton;
