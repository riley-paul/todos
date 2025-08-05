import React from "react";

import {
  Badge,
  Dialog,
  IconButton,
  Kbd,
  ScrollArea,
  Separator,
  Strong,
  Text,
  TextField,
  Tooltip,
  VisuallyHidden,
} from "@radix-ui/themes";
import { useEventListener } from "usehooks-ts";
import { useQuery } from "@tanstack/react-query";
import { qLists, qTodos } from "@/lib/client/queries";
import UserBubbleGroup from "./ui/user-bubble-group";
import TextWithLinks from "./ui/text-with-links";
import { cn } from "@/lib/client/utils";
import { useNavigate } from "@tanstack/react-router";
import useMutations from "@/app/hooks/use-mutations";
import { goToList } from "@/lib/client/links";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Command } from "cmdk";
import Drawer from "./ui/drawer";
import { useIsMobile } from "@/app/hooks/use-is-mobile";

type SearchItemProps = React.PropsWithChildren<{
  value?: string;
  onSelect: () => void;
}>;

const SearchItem: React.FC<SearchItemProps> = ({
  value,
  onSelect,
  children,
}) => {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className={cn(
        "flex cursor-default select-none items-center gap-2 rounded-2 px-3 py-2 text-2 transition-colors data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent-4 data-[disabled=true]:opacity-50",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "data-[selected=true]:bg-accent-4",
      )}
    >
      {children}
    </Command.Item>
  );
};

const SearchGroupHeading: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <div className="px-3 py-1">
      <Text
        size="1"
        weight="bold"
        color="gray"
        className="select-none uppercase"
      >
        {children}
      </Text>
    </div>
  );
};

const Trigger: React.FC<{ open: () => void }> = ({ open }) => {
  return (
    <Tooltip
      content={
        <>
          Search <Kbd>⌘ + K</Kbd>
        </>
      }
      side="bottom"
      align="center"
    >
      <IconButton variant="soft" radius="full" onClick={open}>
        <SearchIcon className="size-4" />
      </IconButton>
    </Tooltip>
  );
};

type ContentProps = {
  handleClose: () => void;
  className?: string;
  textFieldProps?: TextField.RootProps;
};

const Content: React.FC<ContentProps> = ({
  handleClose,
  className,
  textFieldProps,
}) => {
  const { data: lists = [] } = useQuery(qLists);
  const { data: todos = [] } = useQuery(qTodos("all"));

  const [value, setValue] = React.useState("");
  const navigate = useNavigate();
  const { createList, createTodo } = useMutations();

  return (
    <Command className={cn("flex flex-col overflow-hidden", className)}>
      <Command.Input
        asChild
        value={value}
        onValueChange={setValue}
        placeholder="Type a command or search..."
      >
        <TextField.Root autoFocus {...textFieldProps}>
          <TextField.Slot side="left">
            <SearchIcon className="size-4 text-accent-10" />
          </TextField.Slot>
        </TextField.Root>
      </Command.Input>
      <Separator size="4" />
      <ScrollArea className="flex-1 overflow-auto">
        <Command.List className="p-2 pr-3">
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group>
            <SearchGroupHeading>Lists</SearchGroupHeading>
            {value && (
              <SearchItem
                onSelect={() =>
                  createList.mutate({ name: value }, { onSuccess: handleClose })
                }
              >
                <PlusIcon className="size-4 text-accent-10" />
                Create new list <Strong>"{value}"</Strong>
              </SearchItem>
            )}
            {lists.map((list) => (
              <SearchItem
                key={list.id}
                value={list.name + list.id}
                onSelect={() => {
                  handleClose();
                  navigate(goToList(list.id));
                }}
              >
                <span>{list.name}</span>
                <Text className="font-mono text-accentA-12">
                  {list.todoCount}
                </Text>
                <div className="ml-auto">
                  <UserBubbleGroup users={list.otherUsers} />
                </div>
              </SearchItem>
            ))}
          </Command.Group>
          <div className="px-3 py-3">
            <Separator size="4" />
          </div>
          <Command.Group>
            <SearchGroupHeading>Todos</SearchGroupHeading>
            {value && (
              <SearchItem
                onSelect={() =>
                  createTodo.mutate(
                    { data: { text: value, listId: null } },
                    { onSuccess: handleClose },
                  )
                }
              >
                <PlusIcon className="size-4 text-accent-10" />
                Create new todo <Strong>"{value}"</Strong>
              </SearchItem>
            )}
            {todos.map((todo) => (
              <SearchItem
                key={todo.id}
                value={[todo.text, todo.id, todo.list?.id]
                  .filter(Boolean)
                  .join("~")}
                onSelect={() => {
                  handleClose();
                  navigate(goToList(todo.list?.id, todo.id));
                }}
              >
                <span
                  className={cn(
                    todo.isCompleted && "text-gray-10 line-through",
                  )}
                >
                  <TextWithLinks text={todo.text} />
                </span>
                {todo.list && (
                  <Badge className="ml-auto">{todo.list.name}</Badge>
                )}
              </SearchItem>
            ))}
          </Command.Group>
        </Command.List>
      </ScrollArea>
    </Command>
  );
};

const AppSearch: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useIsMobile();

  useEventListener("keydown", (event) => {
    if (event.key === "k" && event.metaKey) {
      event.preventDefault();
      setIsOpen(true);
    }
  });

  if (isMobile) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        <Trigger open={() => setIsOpen(true)} />
        <Drawer.Content className="h-5/6 px-0">
          <VisuallyHidden>
            <Drawer.Title>Search</Drawer.Title>
            <Drawer.Description>
              Search for lists or todos. Use the arrow keys to navigate results.
            </Drawer.Description>
          </VisuallyHidden>
          <Content
            handleClose={() => setIsOpen(false)}
            textFieldProps={{ className: "m-3" }}
          />
        </Drawer.Content>
      </Drawer.Root>
    );
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Trigger open={() => setIsOpen(true)} />
      <Dialog.Content size="1" className="overflow-hidden p-0">
        <VisuallyHidden>
          <Dialog.Title>Search</Dialog.Title>
          <Dialog.Description>
            Search for lists or todos. Use the arrow keys to navigate results.
          </Dialog.Description>
        </VisuallyHidden>
        <Content
          className="max-h-[500px]"
          handleClose={() => setIsOpen(false)}
          textFieldProps={{
            variant: "soft",
            style: { borderRadius: 0 },
            className: "h-auto bg-gray-1 px-2 py-3 outline-none",
          }}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AppSearch;
