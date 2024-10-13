import React from "react";
import QueryGuard from "./base/query-guard";
import { cn } from "@/lib/utils";
import DeleteButton from "./ui/delete-button";
import useMutations from "@/hooks/use-mutations";
import type { TodoSelect } from "@/lib/types";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { Checkbox } from "./ui/checkbox";
import SingleInputForm from "./single-input-form";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai/react";
import { selectedListAtom } from "@/lib/store";
import { actions } from "astro:actions";
import UserBubble from "./base/user-bubble";

interface Props {
  todo: TodoSelect;
}

const Todo: React.FC<Props> = (props) => {
  const { todo } = props;
  const { deleteTodo, updateTodo } = useMutations();

  const [editorOpen, setEditorOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setEditorOpen(false));
  useEventListener("keydown", (e) => {
    if (e.key === "Escape") setEditorOpen(false);
  });

  React.useEffect(() => {
    setEditorOpen(false);
  }, [todo]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex min-h-10 items-center gap-2 rounded-md px-3 py-1 text-sm transition-colors ease-out hover:bg-muted/20",
        deleteTodo.isPending && "opacity-50",
      )}
    >
      {editorOpen ? (
        <SingleInputForm
          className="h-8"
          initialValue={todo.text}
          handleSubmit={(text) => {
            updateTodo
              .mutateAsync({
                id: todo.id,
                data: { text },
              })
              .then(() => setEditorOpen(false));
          }}
        />
      ) : (
        <>
          <Checkbox
            className="shrink-0 rounded-full"
            disabled={updateTodo.isPending}
            checked={todo.isCompleted}
            onCheckedChange={() =>
              updateTodo.mutate({
                id: todo.id,
                data: { isCompleted: !todo.isCompleted },
              })
            }
          />
          <button
            onClick={() => setEditorOpen(true)}
            className={cn(
              "flex-1 text-left",
              todo.isCompleted && "text-muted-foreground line-through",
            )}
          >
            {todo.text}
          </button>
          {!todo.isAuthor && <UserBubble user={todo.author} />}
          <DeleteButton
            handleDelete={() => deleteTodo.mutate({ id: todo.id })}
          />
        </>
      )}
    </div>
  );
};

const TodoList: React.FC = () => {
  const listId = useAtomValue(selectedListAtom);
  const todosQuery = useQuery({
    queryKey: ["todos", listId],
    queryFn: () => actions.getTodos.orThrow({ listId }),
  });

  console.log(todosQuery.data);
  return (
    <QueryGuard query={todosQuery} noDataString="No tasks yet">
      {(todos) => (
        <div className="grid gap-1">
          {todos.map((todo) => (
            <Todo key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </QueryGuard>
  );
};

export default TodoList;
