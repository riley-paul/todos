import React from "react";
import type { TodoSelect } from "@/lib/types";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import useMutations from "../hooks/use-mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>Change your mind?</DialogDescription>
        </DialogHeader>

        <form
          id={formId}
          onSubmit={async (e) => {
            e.preventDefault();
            await updateTodo.mutateAsync({
              id: todo.id,
              data: { text: todoText },
            });
            setIsOpen(false);
          }}
        >
          <Textarea
            className="bg-input/50"
            rows={5}
            placeholder="What needs to be done?"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
          />
          <input type="hidden" />
        </form>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button type="submit" form={formId}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TodoEditor;
