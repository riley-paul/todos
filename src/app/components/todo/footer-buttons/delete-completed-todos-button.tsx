import { useDeleteCompletedTodosMutation } from "@/app/gql.gen";
import useNumCompletedTodos from "@/app/hooks/actions/use-num-completed-todos";
import { Button } from "@radix-ui/themes";
import { ListXIcon } from "lucide-react";
import { toast } from "sonner";

type Props = { listId: string };

const DeleteCompletedTodosButton: React.FC<Props> = ({ listId }) => {
  const [deleteCompletedTodos] = useDeleteCompletedTodosMutation({
    onCompleted: () => {
      toast.success("Completed todos deleted");
    },
  });
  const numCompleted = useNumCompletedTodos(listId);

  return (
    <Button
      size="1"
      variant="ghost"
      color="gray"
      onClick={() => deleteCompletedTodos({ variables: { listId } })}
      disabled={numCompleted === 0}
    >
      <ListXIcon className="size-3" />
      Clear
    </Button>
  );
};

export default DeleteCompletedTodosButton;
