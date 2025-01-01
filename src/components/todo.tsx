import React from "react";
import useMutations from "@/hooks/use-mutations";
import type { TodoSelect } from "@/lib/types";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import UserBubble from "./base/user-bubble";

import {
  ArrowRight,
  Delete,
  EllipsisVertical,
  Pencil,
  Save,
  type LucideIcon,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions } from "@/lib/queries";
import useSelectedList from "@/hooks/use-selected-list";
import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  Flex,
  IconButton,
  Text,
  TextField,
} from "@radix-ui/themes";

const MenuItem: React.FC<{ text: string; icon: LucideIcon }> = ({
  text,
  icon: Icon,
}) => {
  return (
    <Flex gap="3" align="center" justify="between" width="100%">
      <Text>{text}</Text>
      <Icon className="size-4 text-accent-7" />
    </Flex>
  );
};

const TodoForm: React.FC<{
  initialValue: string;
  handleSubmit: (value: string) => void;
}> = ({ initialValue, handleSubmit }) => {
  const [value, setValue] = React.useState(initialValue);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(value);
      }}
      className="flex w-full items-center gap-rx-2"
    >
      <TextField.Root
        size="2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
        className="flex-1"
      >
        <TextField.Slot side="left">
          <Pencil className="size-4 text-accent-10" />
        </TextField.Slot>
      </TextField.Root>
      <Button
        variant="soft"
        type="submit"
        size="2"
        onClick={() => handleSubmit(value)}
      >
        <Save size="1rem" />
        Save
      </Button>
    </form>
  );
};

const Todo: React.FC<{ todo: TodoSelect }> = ({ todo }) => {
  const { deleteTodo, updateTodo, moveTodo } = useMutations();

  const listsQuery = useQuery(listsQueryOptions);
  const lists = listsQuery.data ?? [];

  const { selectedList } = useSelectedList();

  const [editorOpen, setEditorOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setEditorOpen(false));
  useEventListener("keydown", (e) => {
    if (e.key === "Escape") setEditorOpen(false);
  });

  React.useEffect(() => {
    setEditorOpen(false);
  }, [todo]);

  return (
    <div
      ref={ref}
      className="flex min-h-11 items-center gap-rx-2 rounded-3 px-rx-3 py-rx-1 hover:bg-gray-3"
    >
      {editorOpen ? (
        <TodoForm
          initialValue={todo.text}
          handleSubmit={(text) => {
            updateTodo
              .mutateAsync({
                id: todo.id,
                data: { text },
              })
              .then(() => setEditorOpen(false));
          }}
        />
      ) : (
        <>
          <Checkbox
            size="3"
            variant="soft"
            disabled={updateTodo.isPending}
            checked={todo.isCompleted}
            onCheckedChange={() =>
              updateTodo.mutate({
                id: todo.id,
                data: { isCompleted: !todo.isCompleted },
              })
            }
          />
          <Flex flexGrow="1" align="center" onClick={() => setEditorOpen(true)}>
            <Text size="2">{todo.text}</Text>
          </Flex>
          {todo.list && todo.list.id !== selectedList && (
            <Badge>{todo.list.name}</Badge>
          )}
          {!todo.isAuthor && <UserBubble user={todo.author} size="md" />}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton size="1" variant="ghost">
                <EllipsisVertical className="size-4" />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" className="min-w-40">
              <DropdownMenu.Group>
                <DropdownMenu.Item onClick={() => setEditorOpen(true)}>
                  <MenuItem text="Edit" icon={Pencil} />
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => deleteTodo.mutate({ id: todo.id })}
                >
                  <MenuItem text="Delete" icon={Delete} />
                </DropdownMenu.Item>
              </DropdownMenu.Group>
              {lists.length > 0 && (
                <>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Group>
                    <DropdownMenu.Label>Move</DropdownMenu.Label>
                    {selectedList && (
                      <DropdownMenu.Item
                        onClick={() =>
                          moveTodo.mutate({
                            id: todo.id,
                            data: { listId: null },
                          })
                        }
                      >
                        <MenuItem text="Inbox" icon={ArrowRight} />
                      </DropdownMenu.Item>
                    )}
                    {lists
                      .filter((list) => list.id !== selectedList)
                      .map((list) => (
                        <DropdownMenu.Item
                          key={list.id}
                          onClick={() =>
                            moveTodo.mutate({
                              id: todo.id,
                              data: { listId: list.id },
                            })
                          }
                        >
                          <MenuItem text={list.name} icon={ArrowRight} />
                        </DropdownMenu.Item>
                      ))}
                  </DropdownMenu.Group>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </>
      )}
    </div>
  );
};

export default Todo;
