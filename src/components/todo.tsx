import React from "react";
import { css } from "@emotion/react";
import useMutations from "@/hooks/use-mutations";
import type { TodoSelect } from "@/lib/types";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import SingleInputForm from "./single-input-form";
import UserBubble from "./base/user-bubble";

import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions } from "@/lib/queries";
import useSelectedList from "@/hooks/use-selected-list";
import {
  Badge,
  Box,
  Checkbox,
  DropdownMenu,
  Flex,
  IconButton,
  Text,
} from "@radix-ui/themes";

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
    <Flex
      ref={ref}
      gap="3"
      minHeight="2.5rem"
      px="1rem"
      align="center"
      className={css`
        border-bottom: 1px solid var(--border-color);
      `}
    >
      {editorOpen ? (
        <SingleInputForm
          size="sm"
          autoFocus
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
            disabled={updateTodo.isPending}
            checked={todo.isCompleted}
            onCheckedChange={() =>
              updateTodo.mutate({
                id: todo.id,
                data: { isCompleted: !todo.isCompleted },
              })
            }
          />
          <Box flexGrow="1">
            <Text size="2" onClick={() => setEditorOpen(true)}>
              {todo.text}
            </Text>
          </Box>
          {todo.list && todo.list.id !== selectedList && (
            <Badge>{todo.list.name}</Badge>
          )}
          {!todo.isAuthor && <UserBubble user={todo.author} />}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton size="1" radius="full" variant="soft">
                <i className="fa-solid fa-ellipsis-v" />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Group>
                <DropdownMenu.Item onClick={() => setEditorOpen(true)}>
                  Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => deleteTodo.mutate({ id: todo.id })}
                >
                  Delete
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
                        Inbox
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
                          {list.name}
                        </DropdownMenu.Item>
                      ))}
                  </DropdownMenu.Group>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </>
      )}
    </Flex>
  );
};

export default Todo;
