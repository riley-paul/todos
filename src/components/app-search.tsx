import React, { useEffect } from "react";

import {
  Badge,
  Dialog,
  IconButton,
  Kbd,
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
import useMutations from "@/hooks/use-mutations";
import { goToList } from "@/lib/client/links";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Command } from "cmdk";

type SearchItemProps = React.PropsWithChildren<{
  key?: string;
  value?: string;
  onSelect: () => void;
}>;

const SearchItem: React.FC<SearchItemProps> = ({
  key,
  value,
  onSelect,
  children,
}) => {
  return (
    <Command.Item
      key={key}
      value={value}
      onSelect={onSelect}
      className="flex cursor-default select-none items-center gap-2 px-4 py-2 text-2 transition-colors data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent-3 data-[disabled=true]:opacity-50"
    >
      {children}
    </Command.Item>
  );
};

const SearchGroupHeading: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <div className="px-4 py-1">
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

const AppSearch: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const navigate = useNavigate();

  const { data: lists = [] } = useQuery(qLists);
  const { data: todos = [] } = useQuery(qTodos("all"));

  const { createList, createTodo } = useMutations();

  useEventListener("keydown", (event) => {
    if (event.key === "k" && event.metaKey) {
      event.preventDefault();
      setIsOpen(true);
    }
  });

  useEffect(() => {
    setValue("");
  }, [isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Tooltip
          content={
            <div>
              Search <Kbd>⌘ + K</Kbd>
            </div>
          }
          side="bottom"
          align="center"
        >
          <IconButton
            variant="soft"
            radius="full"
            onClick={() => setIsOpen(true)}
          >
            <SearchIcon className="size-4" />
          </IconButton>
        </Tooltip>
      </Dialog.Trigger>
      <Dialog.Content size="1" className="p-0">
        <VisuallyHidden>
          <Dialog.Title>Search</Dialog.Title>
          <Dialog.Description>
            Search for lists or todos. Use the arrow keys to navigate results.
          </Dialog.Description>
        </VisuallyHidden>
        <Command>
          <Command.Input
            asChild
            value={value}
            onValueChange={setValue}
            placeholder="Type a command or search..."
          >
            <TextField.Root
              variant="soft"
              style={{ borderRadius: 0 }}
              className="h-auto bg-gray-1 px-2 py-3 outline-none"
            >
              <TextField.Slot side="left">
                <SearchIcon className="size-4 text-accent-10" />
              </TextField.Slot>
            </TextField.Root>
          </Command.Input>
          <Separator size="4" />
          <Command.List className="max-h-[400px] overflow-y-auto">
            <Command.Empty>No results found.</Command.Empty>
            <Command.Group>
              <SearchGroupHeading>Lists</SearchGroupHeading>
              {value && (
                <SearchItem
                  onSelect={() =>
                    createList.mutate(
                      { name: value },
                      { onSuccess: () => setIsOpen(false) },
                    )
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
                    setIsOpen(false);
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
            <Command.Separator />
            <Command.Group>
              <SearchGroupHeading>Todos</SearchGroupHeading>
              {value && (
                <SearchItem
                  onSelect={() =>
                    createTodo.mutate(
                      { data: { text: value, listId: null } },
                      { onSuccess: () => setIsOpen(false) },
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
                  value={todo.text + todo.id}
                  onSelect={() => {
                    setIsOpen(false);
                    navigate(goToList(todo.list?.id));
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
        </Command>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AppSearch;
