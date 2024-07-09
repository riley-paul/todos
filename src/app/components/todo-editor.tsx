import React from "react";
import type { TodoSelect } from "@/api/lib/types";
import AdvancedDialog from "./advanced-dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import useMutations from "../hooks/use-mutations";

type Props = {
  todo: TodoSelect;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const TodoEditor: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen, todo } = props;

  const [todoText, setTodoText] = React.useState(todo.text);
  const { updateTodo } = useMutations();
  const formId = `edit-todo-${todo.id}`;

  return (
    <AdvancedDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Edit Todo"
      description="Change your mind?"
      footer={
        <>
          <Button type="submit" form={formId}>
            Submit
          </Button>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Cancel
          </Button>
        </>
      }
    >
      <form
        id={formId}
        onSubmit={async (e) => {
          e.preventDefault();
          await updateTodo.mutateAsync({ id: todo.id, text: todoText });
          setIsOpen(false);
        }}
      >
        <Textarea
          className="bg-input/50"
          placeholder="What needs to be done?"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          onFocus={(e) => e.target.select()}
        />
        <input type="hidden" />
      </form>
    </AdvancedDialog>
  );
};

export default TodoEditor;
