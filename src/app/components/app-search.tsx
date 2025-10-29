import React, { useState } from "react";

import {
  Badge,
  Dialog,
  IconButton,
  ScrollArea,
  Separator,
  Text,
  TextField,
  VisuallyHidden,
} from "@radix-ui/themes";
import { useEventListener } from "usehooks-ts";
import { useQuery } from "@tanstack/react-query";
import { qListSearch, qTodoSearch } from "@/app/lib/queries";
import UserBubbleGroup from "./ui/user-bubble-group";
import TextWithLinks from "./ui/text-with-links";
import { cn } from "@/app/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { SearchIcon, XIcon } from "lucide-react";
import { Command } from "cmdk";
import ResponsiveDialogContent from "./ui/responsive-dialog-content";
import NoSearchResultsScreen from "./screens/no-search-results";

type ContentProps = {
  handleClose: () => void;
};

const itemClassNames = cn(
  "rounded-3 text-2 flex cursor-pointer items-center gap-2 px-3 -mx-3 py-2 transition-colors select-none",
  "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
  "data-[selected=true]:bg-accent-3",
);

const groupClassNames = cn(
  "[&_[cmdk-group-heading]]:opacity-70 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-1 [&_[cmdk-group-heading]]:font-medium",
  "flex flex-col gap-3",
);

const listClassNames = cn(
  "[&_[cmdk-list-sizer]]:flex [&_[cmdk-list-sizer]]:flex-col [&_[cmdk-list-sizer]]:gap-4",
);

const SearchContent: React.FC<ContentProps> = ({ handleClose }) => {
  const navigate = useNavigate();

  const [value, setValue] = useState("");

  const { data: lists = [] } = useQuery(qListSearch(""));
  const { data: todos = [] } = useQuery(qTodoSearch(""));

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
            <Dialog.Close>
              <IconButton radius="full" variant="soft" size="2" color="gray">
                <XIcon className="size-5" />
              </IconButton>
            </Dialog.Close>
          </TextField.Slot>
        </TextField.Root>
      </Command.Input>
      <Separator size="4" />
      <ScrollArea>
        <Command.List
          className={cn("flex-1 overflow-y-auto p-6", listClassNames)}
        >
          <Command.Empty>
            <NoSearchResultsScreen />
          </Command.Empty>
          <Command.Group heading="Lists" className={groupClassNames}>
            {lists.map((list) => (
              <Command.Item
                key={list.id}
                value={[list.name, list.id].join("-")}
                className={itemClassNames}
                onSelect={() => {
                  handleClose();
                  navigate({
                    to: "/todos/$listId",
                    params: { listId: list.id },
                  });
                }}
              >
                <span>{list.name}</span>
                <Text className="text-accentA-12 font-mono">
                  {list.todoCount}
                </Text>
                <div className="ml-auto">
                  <UserBubbleGroup users={list.otherUsers} />
                </div>
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Separator />
          <Command.Group heading="Todos" className={groupClassNames}>
            {todos.map((todo) => (
              <Command.Item
                key={todo.id}
                value={[todo.id, todo.text].join("-")}
                className={itemClassNames}
                onSelect={() => {
                  handleClose();
                  navigate({
                    to: "/todos/$listId",
                    params: { listId: todo.listId },
                    search: { highlightedTodoId: todo.id },
                  });
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
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </ScrollArea>
    </Command>
  );
};

const AppSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEventListener("keydown", (e) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setIsOpen(true);
    }
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <IconButton variant="soft" radius="full">
          <SearchIcon className="size-4" />
        </IconButton>
      </Dialog.Trigger>
      <ResponsiveDialogContent
        fullHeightDrawer
        hideCloseButton
        desktopDrawer
        className="px-0 pt-0"
      >
        <VisuallyHidden>
          <Dialog.Title>Search</Dialog.Title>
          <Dialog.Description>
            Search for lists or todos. Use the arrow keys to navigate results.
          </Dialog.Description>
        </VisuallyHidden>
        <SearchContent handleClose={() => setIsOpen(false)} />
      </ResponsiveDialogContent>
    </Dialog.Root>
  );
};

export default AppSearch;
