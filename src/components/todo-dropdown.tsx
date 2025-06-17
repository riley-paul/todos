import { DropdownMenu, Flex, IconButton, Text } from "@radix-ui/themes";
import React from "react";
import { cn } from "@/lib/client/utils";
import { useQuery } from "@tanstack/react-query";
import { qLists } from "@/lib/client/queries";
import { useParams } from "@tanstack/react-router";
import useTodoActions from "./use-todo-actions";
import { useAtom } from "jotai";
import { selectedTodoIdAtom } from "./todos.store";

const MenuItem: React.FC<{ text: string; icon: string }> = ({ text, icon }) => {
  return (
    <Flex gap="3" align="center" justify="between" width="100%">
      <Text>{text}</Text>
      <i className={cn(icon, "text-accent-8")} />
    </Flex>
  );
};

const TodoDropdown: React.FC<{ todoId: string }> = ({ todoId }) => {
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
        <DropdownMenu.Group>
          <DropdownMenu.Item onClick={handleEdit}>
            <MenuItem text="Edit" icon="fa-solid fa-pen" />
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={handleDelete}>
            <MenuItem text="Delete" icon="fa-solid fa-backspace" />
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        {lists.length > 0 && (
          <>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Label>Move</DropdownMenu.Label>
              {listId && (
                <DropdownMenu.Item onClick={() => handleMove(null)}>
                  <MenuItem text="Inbox" icon="fa-solid fa-arrow-right" />
                </DropdownMenu.Item>
              )}
              {lists
                .filter((list) => list.id !== listId)
                .map((list) => (
                  <DropdownMenu.Item
                    key={list.id}
                    onClick={() => handleMove(list.id)}
                  >
                    <MenuItem text={list.name} icon="fa-solid fa-arrow-right" />
                  </DropdownMenu.Item>
                ))}
            </DropdownMenu.Group>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default TodoDropdown;
