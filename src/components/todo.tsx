import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import DeleteButton from "./ui/delete-button";
import { Check, Loader2 } from "lucide-react";
import useMutations from "@/hooks/use-mutations";
import type { TodoSelect } from "@/lib/types";
import TodoEditor from "./todo-editor";
import useSelectedTag from "@/hooks/use-selected-tag";

interface Props {
  todo: TodoSelect;
}

const TodoItem: React.FC<Props> = (props) => {
  const { todo } = props;
  const { deleteTodo, updateTodo } = useMutations();
  const { toggleTag } = useSelectedTag();

  const [editorOpen, setEditorOpen] = React.useState(false);

  return (
    <>
      <TodoEditor todo={todo} isOpen={editorOpen} setIsOpen={setEditorOpen} />
      <Card
        className={cn(
          "flex items-center gap-2 rounded-md p-2 pr-4 text-sm",
          todo.isCompleted && "bg-card/50",
          deleteTodo.isPending && "opacity-50",
        )}
      >
        <Button
          className="rounded-full"
          variant={todo.isCompleted ? "secondary" : "ghost"}
          size="icon"
          disabled={updateTodo.isPending}
          onClick={() =>
            updateTodo.mutate({
              id: todo.id,
              data: { isCompleted: !todo.isCompleted },
            })
          }
        >
          {updateTodo.isPending ? (
            <Loader2 size="1rem" className="animate-spin" />
          ) : (
            <Check size="1rem" />
          )}
        </Button>
        <button
          onClick={() => setEditorOpen(true)}
          className={cn(
            "flex-1 text-left",
            todo.isCompleted && "text-muted-foreground line-through",
          )}
        >
          {todo.text.split(" ").map((word, index) => {
            const isTag = word.startsWith("#");
            if (isTag) {
              return (
                <>
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTag(word.slice(1));
                    }}
                  >
                    <span className="text-primary transition-all hover:underline">
                      {word}
                    </span>
                  </button>{" "}
                </>
              );
            }
            return <span key={index}>{word} </span>;
          })}
        </button>
        <DeleteButton handleDelete={() => deleteTodo.mutate({ id: todo.id })} />
      </Card>
    </>
  );
};

export default TodoItem;
