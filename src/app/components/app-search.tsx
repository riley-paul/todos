import React from "react";

import {
  Badge,
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
import * as Dialog from "@radix-ui/react-dialog";
import { useEventListener } from "usehooks-ts";
import { useQuery } from "@tanstack/react-query";
import { qLists, qTodos } from "@/lib/client/queries";
import UserBubbleGroup from "./ui/user-bubble-group";
import TextWithLinks from "./ui/text-with-links";
import { cn } from "@/lib/client/utils";
import { useNavigate } from "@tanstack/react-router";
import useMutations from "@/app/hooks/use-mutations";
import { goToList } from "@/lib/client/links";
import { PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { Command } from "cmdk";
import RadixProvider from "./radix-provider";

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

type ContentProps = {
  handleClose: () => void;
};

const SearchContent: React.FC<ContentProps> = ({ handleClose }) => {
  const { data: lists = [] } = useQuery(qLists);
  const { data: todos = [] } = useQuery(qTodos("all"));

  const [value, setValue] = React.useState("");
  const navigate = useNavigate();
  const { createList, createTodo } = useMutations();

  return (
    <Command loop className="flex h-full flex-col overflow-hidden">
      <Command.Input
        asChild
        value={value}
        onValueChange={setValue}
        placeholder="Type a command or search..."
      >
        <TextField.Root
          autoFocus
          variant="soft"
          style={{ borderRadius: 0 }}
          className="h-auto bg-gray-1 px-2 py-3 outline-none"
        >
          <TextField.Slot side="left">
            <SearchIcon className="size-4 text-accent-10" />
          </TextField.Slot>
          <TextField.Slot side="right">
            <Dialog.Close asChild>
              <IconButton radius="full" variant="soft" size="2" color="gray">
                <XIcon className="size-4" />
              </IconButton>
            </Dialog.Close>
          </TextField.Slot>
        </TextField.Root>
      </Command.Input>
      <Separator size="4" />
      <ScrollArea>
        <Command.List className="flex-1 overflow-y-auto p-2 pr-3">
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

type DialogProps = React.PropsWithChildren<{
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}>;

const SearchDialog: React.FC<DialogProps> = ({
  children,
  isOpen,
  setIsOpen,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip
        content={
          <>
            Search <Kbd>⌘ + K</Kbd>
          </>
        }
        side="bottom"
        align="center"
      >
        <Dialog.Trigger asChild>
          <IconButton variant="soft" radius="full">
            <SearchIcon className="size-4" />
          </IconButton>
        </Dialog.Trigger>
      </Tooltip>
      <Dialog.Portal>
        <RadixProvider>
          <Dialog.Overlay className="fixed inset-0 bg-panel backdrop-blur" />
          <Dialog.Content
            className={cn(
              "data-[state=open]:animate-in data-[state=closed]:animate-out fade-in fade-out",
              "fixed inset-1 mx-auto max-w-screen-sm overflow-hidden bg-panel-solid outline-none",
              "sm:my-auto sm:h-[500px]",
              "rounded-3 shadow-3",
            )}
          >
            <VisuallyHidden>
              <Dialog.Title>Search</Dialog.Title>
              <Dialog.Description>
                Search for lists or todos. Use the arrow keys to navigate
                results.
              </Dialog.Description>
            </VisuallyHidden>
            {children}
          </Dialog.Content>
        </RadixProvider>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const AppSearch: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  useEventListener("keydown", (event) => {
    if (event.key === "k" && event.metaKey) {
      event.preventDefault();
      setIsOpen(true);
    }
  });

  return (
    <SearchDialog isOpen={isOpen} setIsOpen={setIsOpen}>
      <SearchContent handleClose={() => setIsOpen(false)} />
    </SearchDialog>
  );
};

export default AppSearch;
