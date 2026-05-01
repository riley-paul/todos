import { Button } from "@radix-ui/themes";
import { ListXIcon } from "lucide-react";
import * as collections from "@/app/lib/collections";
import useGetNumCompletedTodos from "@/app/hooks/actions/use-get-num-completed-todos";

type Props = { listId: string };

const DeleteCompletedTodosButton: React.FC<Props> = ({ listId }) => {
  const numCompleted = useGetNumCompletedTodos(listId);

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
