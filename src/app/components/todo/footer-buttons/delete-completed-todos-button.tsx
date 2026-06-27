<<<<<<< HEAD
import {
  useDeleteCompletedTodosMutation,
  useGetListSuspenseQuery,
} from "@/app/gql.gen";
import { Button } from "@radix-ui/themes";
import { ListXIcon } from "lucide-react";
import { toast } from "sonner";
=======
import { Button } from "@radix-ui/themes";
import { ListXIcon } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { qTodos } from "@/app/lib/queries";
import useMutations from "@/app/hooks/use-mutations";
>>>>>>> origin/main

type Props = { listId: string };

const DeleteCompletedTodosButton: React.FC<Props> = ({ listId }) => {
<<<<<<< HEAD
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
=======
  const { data: numCompleted } = useSuspenseQuery({
    ...qTodos(listId),
    select: (todos) => todos.filter((todo) => todo.isCompleted).length,
  });

  const { deleteCompletedTodos } = useMutations();
>>>>>>> origin/main

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
