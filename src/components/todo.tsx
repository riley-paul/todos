import React from "react";
import { cn } from "@/lib/utils";
import useMutations from "@/hooks/use-mutations";
import type { TodoSelect } from "@/lib/types";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import SingleInputForm from "./single-input-form";
import UserBubble from "./base/user-bubble";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions } from "@/lib/queries";
import useSelectedList from "@/hooks/use-selected-list";
import { Badge, Checkbox } from "@radix-ui/themes";

const Todo: React.FC<{ todo: TodoSelect }> = ({ todo }) => {
  const { deleteTodo, updateTodo, moveTodo } = useMutations();

  const listsQuery = useQuery(listsQueryOptions);
  const lists = listsQuery.data ?? [];

  const { selectedList } = useSelectedList();

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
        (deleteTodo.isPending || updateTodo.isPending) && "opacity-50",
      )}
    >
      {editorOpen ? (
        <SingleInputForm
          size="sm"
          autoFocus
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
            className="size-5 shrink-0 rounded-full"
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghostMuted"
                className="size-7 rounded-full"
              >
                <i className="fa-solid fa-ellipsis-v" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-[50vh] min-w-[11rem] overflow-y-auto"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setEditorOpen(true)}>
                  Edit
                  <DropdownMenuShortcut>
                    <i className="fa-solid fa-pen" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteTodo.mutate({ id: todo.id })}
                >
                  Delete
                  <DropdownMenuShortcut>
                    <i className="fa-solid fa-delete-left" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {lists.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Move</DropdownMenuLabel>
                    {selectedList && (
                      <DropdownMenuItem
                        onClick={() =>
                          moveTodo.mutate({
                            id: todo.id,
                            data: { listId: null },
                          })
                        }
                      >
                        Inbox
                        <DropdownMenuShortcut>
                          <i className="fa-solid fa-arrow-right" />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    )}
                    {lists
                      .filter((list) => list.id !== selectedList)
                      .map((list) => (
                        <DropdownMenuItem
                          key={list.id}
                          onClick={() =>
                            moveTodo.mutate({
                              id: todo.id,
                              data: { listId: list.id },
                            })
                          }
                        >
                          {list.name}
                          <DropdownMenuShortcut>
                            <i className="fa-solid fa-arrow-right" />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuGroup>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
};

export default Todo;
