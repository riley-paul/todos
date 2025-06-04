import useMutations from "@/hooks/use-mutations";
import { useAtom } from "jotai";
import { editingTodoIdAtom, selectedTodoIdAtom } from "./todos.store";

export default function useTodoActions() {
  const { deleteTodo, moveTodo } = useMutations();

  const [selectedTodoId, setSelectedTodoId] = useAtom(selectedTodoIdAtom);
  const [_, setEditingTodoId] = useAtom(editingTodoIdAtom);

  const handleMove = (targetListId: string | null) => {
    if (!selectedTodoId) return;
    moveTodo.mutate(
      { id: selectedTodoId, data: { listId: targetListId } },
      { onSuccess: () => setSelectedTodoId(null) },
    );
  };

  const handleDelete = () => {
    if (!selectedTodoId) return;
    deleteTodo.mutate(
      { id: selectedTodoId },
      { onSuccess: () => setSelectedTodoId(null) },
    );
  };

  const handleEdit = () => {
    setEditingTodoId(selectedTodoId);
    setSelectedTodoId(null);
  };

  return { handleMove, handleEdit, handleDelete };
}
