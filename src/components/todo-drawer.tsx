import { Text } from "@radix-ui/themes";
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

const GroupContainer: React.FC<
  React.PropsWithChildren<{ header?: string }>
> = ({ children, header }) => (
  <div className="grid gap-2">
    {header && (
      <Text size="1" ml="2" weight="medium" color="gray" className="uppercase">
        {header}
      </Text>
    )}
    <div className="grid divide-y rounded-2 bg-panel-translucent backdrop-blur">
      {children}
    </div>
  </div>
);

const MenuItem: React.FC<{
  text: string;
  icon: string;
  onClick: () => void;
}> = ({ text, icon, onClick }) => {
  return (
    <button
      color="gray"
      className="flex items-center justify-between gap-2 px-3 py-2 text-2"
      onClick={onClick}
    >
      <Text weight="medium">{text}</Text>
      <i className={cn("fas fa-sm opacity-80", icon)} />
    </button>
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
        <article className="grid gap-6">
          <GroupContainer>
            <MenuItem text="Edit" icon="fas fa-pen" onClick={handleEdit} />
            <MenuItem
              text="Delete"
              icon="fas fa-backspace"
              onClick={handleDelete}
            />
          </GroupContainer>
          {lists.length > 0 && (
            <GroupContainer header="Move">
              {listId && (
                <MenuItem
                  text="Inbox"
                  icon="fas fa-arrow-right"
                  onClick={() => handleMove(null)}
                />
              )}
              {lists
                .filter((list) => list.id !== listId)
                .map((list) => (
                  <MenuItem
                    key={list.id}
                    text={list.name}
                    icon="fas fa-arrow-right"
                    onClick={() => handleMove(list.id)}
                  />
                ))}
            </GroupContainer>
          )}
        </article>
      </DrawerContent>
    </Drawer>
  );
};

export default TodoDrawer;
