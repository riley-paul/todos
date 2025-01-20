import { Button, IconButton, Text } from "@radix-ui/themes";
import React from "react";
import useSelectedList from "@/hooks/use-selected-list";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions } from "@/lib/queries";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

const MenuItem: React.FC<{
  text: string;
  icon: string;
  onClick: () => void;
}> = ({ text, icon, onClick }) => {
  return (
    <Button variant="surface" className="justify-between" onClick={onClick}>
      <Text color="gray">{text}</Text>
      <i className={`fa-solid ${icon} text-accent-8`} />
    </Button>
  );
};

type Props = {
  handleEdit: () => void;
  handleDelete: () => void;
  handleMove: (listId: string | null) => void;
};

const TodoDrawer: React.FC<Props> = ({
  handleDelete,
  handleEdit,
  handleMove,
}) => {
  const { selectedList } = useSelectedList();

  const listsQuery = useQuery(listsQueryOptions);
  const lists = listsQuery.data ?? [];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <IconButton size="2" variant="ghost">
          <i className="fa-solid fa-ellipsis" />
        </IconButton>
      </DrawerTrigger>
      <DrawerContent>
        <div className="grid gap-2">
          <MenuItem text="Edit" icon="fa-solid fa-pen" onClick={handleEdit} />
          <MenuItem
            text="Delete"
            icon="fa-solid fa-backspace"
            onClick={handleDelete}
          />
          {lists.length > 0 && (
            <>
              <Text size="2" weight="medium" color="gray" mt="2">
                Move
              </Text>
              {selectedList && (
                <MenuItem
                  text="Inbox"
                  icon="fa-solid fa-arrow-right"
                  onClick={() => handleMove(null)}
                />
              )}
              {lists
                .filter((list) => list.id !== selectedList)
                .map((list) => (
                  <MenuItem
                    key={list.id}
                    text={list.name}
                    icon="fa-solid fa-arrow-right"
                    onClick={() => handleMove(list.id)}
                  />
                ))}
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TodoDrawer;
