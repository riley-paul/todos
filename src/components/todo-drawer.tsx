import { Button, IconButton, Text } from "@radix-ui/themes";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions } from "@/lib/queries";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useParams } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const MenuItem: React.FC<{
  text: string;
  icon: string;
  onClick: () => void;
}> = ({ text, icon, onClick }) => {
  return (
    <Button
      variant="soft"
      color="gray"
      className="justify-between"
      onClick={onClick}
    >
      <Text>{text}</Text>
      <i className={cn("fa-solid opacity-80", icon)} />
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
  const { listId } = useParams({ strict: false });

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
              {listId && (
                <MenuItem
                  text="Inbox"
                  icon="fa-solid fa-arrow-right"
                  onClick={() => handleMove(null)}
                />
              )}
              {lists
                .filter((list) => list.id !== listId)
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
