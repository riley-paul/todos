import useDeleteCompletedTodos from "@/app/hooks/actions/use-delete-completed-todos";
import useNumCompletedTodos from "@/app/hooks/actions/use-num-completed-todos";
import { Button } from "@radix-ui/themes";
import { ListXIcon } from "lucide-react";
import { toast } from "sonner";

type Props = { listId: string };

const DeleteCompletedTodosButton: React.FC<Props> = ({ listId }) => {
  const numCompleted = useNumCompletedTodos(listId);
  const [deleteCompletedTodos] = useDeleteCompletedTodos(listId);

  return (
    <Button
      size="1"
      variant="ghost"
      color="gray"
      onClick={() =>
        deleteCompletedTodos({
          variables: { listId },
          onCompleted: () => {
            toast.success(`Deleted ${numCompleted} completed todos`);
          },
        })
      }
      disabled={numCompleted === 0}
    >
      <ListXIcon className="size-3" />
      Clear
    </Button>
  );
};

export default DeleteCompletedTodosButton;
