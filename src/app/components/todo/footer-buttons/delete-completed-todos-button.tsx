import { Button } from "@radix-ui/themes";
import { ListXIcon } from "lucide-react";
import * as collections from "@/app/lib/collections";
import { useSuspenseQuery } from "@tanstack/react-query";
import { qTodosForList } from "@/app/lib/queries";

type Props = { listId: string };

const DeleteCompletedTodosButton: React.FC<Props> = ({ listId }) => {
  const { data: numCompleted } = useSuspenseQuery({
    ...qTodosForList(listId),
    select: (todos) => todos.filter((todo) => todo.isCompleted).length,
  });

  return (
    <Button
      size="1"
      variant="ghost"
      color="gray"
      onClick={() => collections.fns.deleteCompletedTodos({ listId })}
      disabled={numCompleted === 0}
    >
      <ListXIcon className="size-3" />
      Clear
    </Button>
  );
};

export default DeleteCompletedTodosButton;
