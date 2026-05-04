import { Button } from "@radix-ui/themes";
import { ListXIcon } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { qTodos } from "@/app/lib/queries";
import useMutations from "@/app/hooks/use-mutations";

type Props = { listId: string };

const DeleteCompletedTodosButton: React.FC<Props> = ({ listId }) => {
  const { data: numCompleted } = useSuspenseQuery({
    ...qTodos(listId),
    select: (todos) => todos.filter((todo) => todo.isCompleted).length,
  });

  const { deleteCompletedTodos } = useMutations();

  return (
    <Button
      size="1"
      variant="ghost"
      color="gray"
      onClick={() => deleteCompletedTodos.mutate({ listId })}
      disabled={numCompleted === 0}
    >
      <ListXIcon className="size-3" />
      Clear
    </Button>
  );
};

export default DeleteCompletedTodosButton;
