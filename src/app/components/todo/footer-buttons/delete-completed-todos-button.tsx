import useGetTodos from "@/app/hooks/actions/use-get-todos";
import { Button } from "@radix-ui/themes";
import { ListXIcon } from "lucide-react";
import * as collections from "@/app/lib/collections";

type Props = { listId: string };

const DeleteCompletedTodosButton: React.FC<Props> = ({ listId }) => {
  const todos = useGetTodos(listId);
  const numCompleted = todos.filter((i) => i.isCompleted).length;

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
