import { Button, Text } from "@radix-ui/themes";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions } from "@/lib/client/queries";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useParams } from "@tanstack/react-router";
import { cn } from "@/lib/client/utils";
import { useAtom } from "jotai";
import { selectedTodoIdAtom } from "./todos.store";
import useTodoActions from "./use-todo-actions";
import { useIsMobile } from "@/hooks/use-is-mobile";

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

const TodoDrawer: React.FC = () => {
  const { handleDelete, handleEdit, handleMove } = useTodoActions();
  const [selectedTodoId, setSelectedTodoId] = useAtom(selectedTodoIdAtom);

  const { listId } = useParams({ strict: false });
  const { data: lists = [] } = useQuery(listsQueryOptions);
  const isMobile = useIsMobile();

  return (
    <Drawer
      open={!!selectedTodoId && isMobile}
      onOpenChange={(isOpen) => {
        if (!isOpen) setSelectedTodoId(null);
      }}
    >
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
