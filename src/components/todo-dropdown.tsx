import { DropdownMenu, Flex, IconButton, Text } from "@radix-ui/themes";
import React from "react";
import { cn } from "@/lib/utils";
import useSelectedList from "@/hooks/use-selected-list";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions } from "@/lib/queries";

const MenuItem: React.FC<{ text: string; icon: string }> = ({ text, icon }) => {
  return (
    <Flex gap="3" align="center" justify="between" width="100%">
      <Text>{text}</Text>
      <i className={cn(icon, "text-accent-8")} />
    </Flex>
  );
};

type Props = {
  handleEdit: () => void;
  handleDelete: () => void;
  handleMove: (listId: string | null) => void;
};

const TodoDropdown: React.FC<Props> = ({
  handleDelete,
  handleEdit,
  handleMove,
}) => {
  const { selectedList } = useSelectedList();

  const listsQuery = useQuery(listsQueryOptions);
  const lists = listsQuery.data ?? [];

  return (
    <DropdownMenu.Root>
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
              {selectedList && (
                <DropdownMenu.Item onClick={() => handleMove(null)}>
                  <MenuItem text="Inbox" icon="fa-solid fa-arrow-right" />
                </DropdownMenu.Item>
              )}
              {lists
                .filter((list) => list.id !== selectedList)
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
