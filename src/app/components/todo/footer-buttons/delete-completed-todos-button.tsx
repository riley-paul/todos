import { useLiveTodos } from "@/app/hooks/use-live-todos";
import { todoCollection } from "@/app/lib/collections";
import { Button } from "@radix-ui/themes";
import { ListXIcon } from "lucide-react";

type Props = { listId: string };

const DeleteCompletedTodosButton: React.FC<Props> = ({ listId }) => {
  const { completedTodos } = useLiveTodos(listId);

  return (
    <Button
      size="1"
      variant="ghost"
      color="gray"
      onClick={() => todoCollection.delete(completedTodos.map(({ id }) => id))}
      disabled={completedTodos.length === 0}
    >
      <ListXIcon className="size-3" />
      Clear
    </Button>
  );
};

export default DeleteCompletedTodosButton;
