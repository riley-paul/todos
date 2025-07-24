import useMutations from "@/hooks/use-mutations";
import { qTodos } from "@/lib/client/queries";
import type { SelectedList } from "@/lib/types";
import { Button } from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ListXIcon } from "lucide-react";

type Props = { listId: SelectedList };

const DeleteCompletedTodosButton: React.FC<Props> = ({ listId }) => {
  const { deleteCompletedTodos } = useMutations();
  const { data: todos } = useSuspenseQuery(qTodos(listId));
  const numCompleted = todos.filter((i) => i.isCompleted).length;

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
