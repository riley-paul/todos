import { Button } from "@radix-ui/themes";
import { SquareMinusIcon } from "lucide-react";
import React from "react";
import * as collections from "@/app/lib/collections";
import useGetNumCompletedTodos from "@/app/hooks/actions/use-get-num-completed-todos";

type Props = { listId: string };

const UncheckAllTodosButton: React.FC<Props> = ({ listId }) => {
  const numCompleted = useGetNumCompletedTodos(listId);

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
