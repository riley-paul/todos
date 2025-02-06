import React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge, IconButton, Kbd, Text, Tooltip } from "@radix-ui/themes";
import { useEventListener } from "usehooks-ts";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions, todosQueryOptions } from "@/lib/queries";
import UserBubbleGroup from "./ui/user-bubble-group";
import TextWithLinks from "./ui/text-with-links";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import useMutations from "@/hooks/use-mutations";

const AppSearch: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const navigate = useNavigate();

  const { data: lists = [] } = useQuery(listsQueryOptions);
  const { data: todos = [] } = useQuery(todosQueryOptions("all"));

  const { createList, createTodo } = useMutations();

  useEventListener("keydown", (event) => {
    if (event.key === "k" && event.metaKey) {
      event.preventDefault();
      setIsOpen(true);
    }
  });

  return (
    <>
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
          <i className="fas fa-search" />
        </IconButton>
      </Tooltip>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          value={value}
          onValueChange={setValue}
          placeholder="Type a command or search..."
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Lists">
            {value && (
              <CommandItem
                onSelect={() =>
                  createList.mutate(
                    { name: value },
                    { onSuccess: () => setIsOpen(false) },
                  )
                }
              >
                <i className="fas fa-plus text-accent-10" />
                <span>Create new list "{value}"</span>
              </CommandItem>
            )}
            {lists.map((list) => (
              <CommandItem
                key={list.id}
                value={list.name}
                onSelect={() => {
                  setIsOpen(false);
                  navigate({
                    to: "/todos/$listId",
                    params: { listId: list.id },
                  });
                }}
              >
                <span>{list.name}</span>
                <Text className="font-mono text-accentA-12">
                  {list.todoCount}
                </Text>
                <div className="ml-auto">
                  <UserBubbleGroup users={list.otherUsers} />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Todos">
            {value && (
              <CommandItem
                onSelect={() =>
                  createTodo.mutate(
                    { text: value, listId: null },
                    { onSuccess: () => setIsOpen(false) },
                  )
                }
              >
                <i className="fas fa-plus text-accent-10" />
                <span>Create new todo "{value}"</span>
              </CommandItem>
            )}
            {todos.map((todo) => (
              <CommandItem
                key={todo.id}
                value={todo.text}
                onSelect={() => {
                  setIsOpen(false);
                  navigate({
                    to: todo.list ? "/todos/$listId" : "/",
                    params: { listId: todo.list?.id },
                  });
                }}
              >
                <Text
                  size="2"
                  className={cn(
                    todo.isCompleted && "text-gray-10 line-through",
                  )}
                >
                  <TextWithLinks text={todo.text} />
                </Text>
                {todo.list && (
                  <Badge className="ml-auto">{todo.list.name}</Badge>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default AppSearch;
