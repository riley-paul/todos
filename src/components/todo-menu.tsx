import { DropdownMenu, IconButton } from "@radix-ui/themes";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { qLists } from "@/lib/client/queries";
import { useParams } from "@tanstack/react-router";
import useTodoActions from "./use-todo-actions";
import { useAtom } from "jotai";
import { selectedTodoIdAtom } from "./todos.store";
import { CornerDownRightIcon, DeleteIcon, Edit2Icon } from "lucide-react";

const TodoMenu: React.FC<{ todoId: string }> = ({ todoId }) => {
  const { handleDelete, handleEdit, handleMove } = useTodoActions();
  const [_, setSelectedTodoId] = useAtom(selectedTodoIdAtom);

  const { listId } = useParams({ strict: false });
  const { data: lists = [] } = useQuery(qLists);

  return (
    <DropdownMenu.Root
      onOpenChange={(isOpen) => setSelectedTodoId(isOpen ? todoId : null)}
    >
      <DropdownMenu.Trigger>
        <IconButton size="2" variant="ghost">
          <i className="fa-solid fa-ellipsis" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="min-w-48">
        <DropdownMenu.Item onClick={handleEdit}>
          <Edit2Icon className="size-4 opacity-70" />
          <span>Edit</span>
        </DropdownMenu.Item>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <CornerDownRightIcon className="size-4 opacity-70" />
            <span>Move</span>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            {listId && (
              <DropdownMenu.Item onClick={() => handleMove(null)}>
                Inbox
              </DropdownMenu.Item>
            )}
            {lists
              .filter((list) => list.id !== listId)
              .map((list) => (
                <DropdownMenu.Item
                  key={list.id}
                  onClick={() => handleMove(list.id)}
                >
                  {list.name}
                </DropdownMenu.Item>
              ))}
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Item color="red" onClick={handleDelete}>
          <DeleteIcon className="size-4 opacity-70" />
          <span>Delete</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default TodoMenu;
