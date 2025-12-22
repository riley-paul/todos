import { useLiveTodos } from "@/app/hooks/use-live-todos";
import { todoCollection } from "@/app/lib/collections";
import { Button } from "@radix-ui/themes";
import { SquareMinusIcon } from "lucide-react";
import React from "react";

type Props = { listId: string };

const UncheckAllTodosButton: React.FC<Props> = ({ listId }) => {
  const { completedTodos } = useLiveTodos(listId);

  return (
    <Button
      size="1"
      variant="ghost"
      color="gray"
      onClick={() =>
        todoCollection.update(
          completedTodos.map(({ id }) => id),
          (drafts) => {
            drafts.forEach((draft) => {
              draft.isCompleted = false;
            });
          },
        )
      }
      disabled={completedTodos.length === 0}
    >
      <SquareMinusIcon className="size-3" />
      Uncheck
    </Button>
  );
};

export default UncheckAllTodosButton;
