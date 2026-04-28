import {
  useDeleteCompletedTodosMutation,
  useGetListSuspenseQuery,
} from "@/app/gql.gen";
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
  const {
    data: { list },
  } = useGetListSuspenseQuery({ variables: { listId } });
  const todos = list?.todos || [];

  const numCompleted = todos.filter((i) => i.isCompleted).length;

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
