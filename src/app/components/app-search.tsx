import React, { useState } from "react";

import {
  Dialog,
  IconButton,
  Kbd,
  ScrollArea,
  Separator,
  TextField,
  Tooltip,
  VisuallyHidden,
} from "@radix-ui/themes";
import { cn } from "@/app/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { SearchIcon, XIcon } from "lucide-react";
import { Command } from "cmdk";
import ResponsiveDialogContent from "./ui/responsive-dialog-content";
import LoadingScreen from "./screens/loading";
import ListRow from "./list/list-row";
import TodoRow from "./todo/todo-row";
import NoSearchResultsScreen from "./screens/no-search-results";
import { formatForDisplay, useHotkey } from "@tanstack/react-hotkeys";

type ContentProps = {
  handleClose: () => void;
};

const itemClassNames = cn(
  "rounded-3 flex cursor-pointer items-center gap-2 px-3 -mx-3 py-2 transition-colors select-none",
  "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
  "data-[selected=true]:bg-accent-3",
);

const groupClassNames = cn(
  "[&_[cmdk-group-heading]]:opacity-70 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-1 [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:flex [&_[cmdk-group-heading]]:items-center [&_[cmdk-group-heading]]:gap-2",
  "[&_[cmdk-group-heading]::after]:content-[''] [&_[cmdk-group-heading]::after]:block [&_[cmdk-group-heading]::after]:h-px [&_[cmdk-group-heading]::after]:bg-gray-7 [&_[cmdk-group-heading]::after]:w-full",
  "flex flex-col gap-2",
);

const listClassNames = cn(
  "[&_[cmdk-list-sizer]]:flex [&_[cmdk-list-sizer]]:flex-col [&_[cmdk-list-sizer]]:gap-3",
);

const CommandInput: React.FC = () => (
  <Command.Input asChild placeholder="Search...">
    <TextField.Root
      size="3"
      variant="soft"
      style={{ borderRadius: 0 }}
      className="bg-gray-1 h-14 px-3 outline-none"
    >
      <TextField.Slot side="left">
        <SearchIcon className="text-accent-10 size-4" />
      </TextField.Slot>
      <TextField.Slot side="right">
        <Dialog.Close>
          <IconButton radius="full" variant="ghost" size="2" color="gray">
            <XIcon className="size-5" />
          </IconButton>
        </Dialog.Close>
      </TextField.Slot>
    </TextField.Root>
  </Command.Input>
);

const CommandList: React.FC<{ handleClose: () => void }> = ({
  handleClose,
}) => {
  const navigate = useNavigate();

  const { data: lists = [], isLoading: listsLoading } = useQuery(
    qListSearch(""),
  );
  const { data: todos = [], isLoading: todosLoading } = useQuery(
    qTodoSearch(""),
  );

  if (listsLoading || todosLoading) {
    return <LoadingScreen />;
  }

  return (
    <Command.List className={cn("flex-1 overflow-y-auto p-6", listClassNames)}>
      <Command.Group
        heading={
          <span className="flex items-center gap-2">
            Lists <span className="font-mono opacity-70"> {lists.length}</span>
          </span>
        }
        className={groupClassNames}
      >
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
            <ListRow list={list} />
          </Command.Item>
        ))}
      </Command.Group>
      <Command.Separator />
      <Command.Group
        heading={
          <span className="flex items-center gap-2">
            Todos <span className="font-mono opacity-70"> {todos.length}</span>
          </span>
        }
        className={groupClassNames}
      >
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
            <TodoRow todo={todo} />
          </Command.Item>
        ))}
      </Command.Group>
    </Command.List>
  );
};

const SearchContent: React.FC<ContentProps> = ({ handleClose }) => {
  return (
    <Command loop className="flex h-full flex-col overflow-hidden">
      <CommandInput />
      <Separator size="4" />
      <ScrollArea>
        <CommandList handleClose={handleClose} />
        <Command.Empty>
          <NoSearchResultsScreen />
        </Command.Empty>
      </ScrollArea>
    </Command>
  );
};

const AppSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useHotkey("Mod+K", () => setIsOpen(true));

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip
        side="bottom"
        content={
          <span className="flex items-center gap-1">
            Search
            <Kbd>{formatForDisplay("Mod+K")}</Kbd>
          </span>
        }
      >
        <Dialog.Trigger>
          <IconButton variant="soft" radius="full">
            <SearchIcon className="size-4" />
          </IconButton>
        </Dialog.Trigger>
      </Tooltip>
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
