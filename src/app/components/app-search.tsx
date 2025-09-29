import React from "react";

import {
  Badge,
  IconButton,
  ScrollArea,
  Separator,
  Strong,
  Text,
  TextField,
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
        "rounded-2 text-2 data-[selected=true]:bg-accent-4 flex cursor-default items-center gap-2 px-3 py-2 transition-colors select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
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
        className="uppercase select-none"
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
          className="bg-gray-1 h-auto px-2 py-3 outline-none"
        >
          <TextField.Slot side="left">
            <SearchIcon className="text-accent-10 size-4" />
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
                <PlusIcon className="text-accent-10 size-4" />
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
                <Text className="text-accentA-12 font-mono">
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
                <PlusIcon className="text-accent-10 size-4" />
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
      <Dialog.Trigger asChild>
        <IconButton variant="soft" radius="full">
          <SearchIcon className="size-4" />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <RadixProvider>
          <Dialog.Overlay
            className={cn(
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=open]:fade-in data-[state=closed]:fade-out",
              "bg-panel fixed inset-0 backdrop-blur duration-300",
            )}
          />
          <Dialog.Content
            className={cn(
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=open]:fade-in data-[state=closed]:fade-out",
              "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
              "bg-panel-solid fixed inset-1 mx-auto max-w-screen-sm overflow-hidden duration-300 outline-none",
              "rounded-3 shadow-3 sm:my-auto sm:h-[500px]",
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
