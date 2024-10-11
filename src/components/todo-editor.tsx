import React from "react";
import type { TodoSelect } from "@/lib/types";
import { Button } from "./ui/button";
import useMutations from "../hooks/use-mutations";
import { Input } from "./ui/input";
import { useMediaQuery } from "usehooks-ts";
import { MOBILE_MEDIA_QUERY } from "@/lib/constants";
import { Save } from "lucide-react";

type Props = {
  todo: TodoSelect;
  onSubmit?: () => void;
};

const TodoEditor: React.FC<Props> = (props) => {
  const { todo, onSubmit } = props;

  const [todoText, setTodoText] = React.useState(todo.text);
  const { updateTodo } = useMutations();
  const formId = `edit-todo-${todo.id}`;

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  return (
    <form
      className="flex w-full gap-2 items-center"
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
        className="h-7"
        autoFocus
        placeholder="What needs to be done?"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
      />
      <input type="hidden" />
      <Button
        size={isMobile ? "icon" : "default"}
        className="shrink-0 h-7"
        type="submit"
        form={formId}
      >
        <Save className="size-4" />
        {!isMobile && <span className="ml-2">Save</span>}
      </Button>
    </form>
  );
};

export default TodoEditor;
