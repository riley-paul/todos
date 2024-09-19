import React from "react";
import type { TodoSelect } from "@/lib/types";
import { Button } from "./ui/button";
import useMutations from "../hooks/use-mutations";
import { Input } from "./ui/input";

type Props = {
  todo: TodoSelect;
  onSubmit?: () => void;
};

const TodoEditor: React.FC<Props> = (props) => {
  const { todo, onSubmit } = props;

  const [todoText, setTodoText] = React.useState(todo.text);
  const { updateTodo } = useMutations();
  const formId = `edit-todo-${todo.id}`;

  return (
    <form
      className="flex w-full gap-2"
      id={formId}
      onSubmit={async (e) => {
        e.preventDefault();
        await updateTodo.mutateAsync({
          id: todo.id,
          data: { text: todoText },
        });
        onSubmit?.();
      }}
    >
      <Input
        autoFocus
        placeholder="What needs to be done?"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
      />
      <input type="hidden" />
      <Button type="submit" form={formId}>
        Save
      </Button>
    </form>
  );
};

export default TodoEditor;
