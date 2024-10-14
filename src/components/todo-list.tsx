import React from "react";
import QueryGuard from "./base/query-guard";
import { cn } from "@/lib/utils";
import DeleteButton from "./ui/delete-button";
import useMutations from "@/hooks/use-mutations";
import type { TodoSelect } from "@/lib/types";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Checkbox } from "./ui/checkbox";
import SingleInputForm from "./single-input-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai/react";
import { selectedListAtom } from "@/lib/store";
import { actions } from "astro:actions";
import UserBubble from "./base/user-bubble";
import { ChevronUp, Eraser } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Badge } from "./ui/badge";

interface Props {
  todo: TodoSelect;
}

const Todo: React.FC<Props> = (props) => {
  const { todo } = props;
  const { deleteTodo, updateTodo } = useMutations();

  const selectedList = useAtomValue(selectedListAtom);

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
          size="sm"
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
          {todo.list && todo.list.id !== selectedList && (
            <Badge variant="outline">{todo.list.name}</Badge>
          )}
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

  const numCompleted =
    todosQuery.data?.filter((i) => i.isCompleted).length ?? 0;

  const { mutate: deleteCompleted } = useMutation({
    mutationFn: actions.deleteCompletedTodos.orThrow,
    onSuccess: () => {
      toast.success(`Deleted ${numCompleted} completed tasks`);
    },
  });

  const [showCompleted, setShowCompleted] = React.useState(false);
  const selectedList = useAtomValue(selectedListAtom);

  return (
    <QueryGuard query={todosQuery} noDataString="No tasks yet">
      {(todos) => (
        <>
          <div className="grid gap-1">
            {todos
              .filter((i) => !i.isCompleted)
              .map((todo) => (
                <Todo key={todo.id} todo={todo} />
              ))}
          </div>
          {numCompleted > 0 && (
            <Collapsible
              open={showCompleted}
              onOpenChange={setShowCompleted}
              className="grid gap-2"
            >
              <div className="flex items-center justify-between gap-2 px-1">
                <CollapsibleTrigger asChild>
                  <Button
                    size="sm"
                    className="flex h-6 gap-2 px-2"
                    variant="ghost"
                  >
                    <span>Completed</span>
                    <span className="opacity-80">{numCompleted}</span>
                    <ChevronUp
                      className={cn(
                        "size-4 transition-transform",
                        showCompleted && "-rotate-180",
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <Button
                  size="sm"
                  className="h-6 px-2"
                  variant="linkMuted"
                  onClick={() => deleteCompleted({ listId: selectedList })}
                >
                  <Eraser className="mr-1 size-4" />
                  Clear completed
                </Button>
              </div>

              <CollapsibleContent className="grid gap-1 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                {todos
                  .filter((i) => i.isCompleted)
                  .map((todo) => (
                    <Todo key={todo.id} todo={todo} />
                  ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </>
      )}
    </QueryGuard>
  );
};

export default TodoList;
