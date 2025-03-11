import React from "react";
import useMutations from "@/hooks/use-mutations";
import type { TodoSelect } from "@/lib/types";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import UserBubble from "./ui/user-bubble";
import {
  Badge,
  Button,
  Checkbox,
  Flex,
  Spinner,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { cn } from "@/lib/client/utils";
import {
  focusInputAtEnd,
  resizeTextArea,
} from "@/lib/client/utils";
import TextWithLinks from "./ui/text-with-links";
import TodoDropdown from "./todo-dropdown";
import { useIsMobile } from "@/hooks/use-is-mobile";
import TodoDrawer from "./todo-drawer";
import { Link, useParams } from "@tanstack/react-router";
import { goToList } from "@/lib/client/links";

const TodoForm: React.FC<{
  initialValue: string;
  handleSubmit: (value: string) => void;
}> = ({ initialValue, handleSubmit }) => {
  const [value, setValue] = React.useState(initialValue);
  const ref = React.useRef<HTMLTextAreaElement>(null);

  useEventListener("resize", () => {
    resizeTextArea(ref.current);
  });

  React.useEffect(() => {
    resizeTextArea(ref.current);
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(value);
      }}
      className="flex w-full items-start gap-2"
    >
      <TextArea
        ref={ref}
        size="2"
        value={value}
        autoFocus
        rows={1}
        className="min-h-min flex-1"
        onChange={(e) => {
          setValue(e.target.value);
          resizeTextArea(e.target);
        }}
        onFocus={(e) => {
          focusInputAtEnd(e.target);
          resizeTextArea(e.target);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit(value);
          }
        }}
      />
      <Button
        variant="soft"
        type="submit"
        size="2"
        onClick={() => handleSubmit(value)}
      >
        <i className="fa-solid fa-save" />
        Save
      </Button>
    </form>
  );
};

const Todo: React.FC<{ todo: TodoSelect }> = ({ todo }) => {
  const { deleteTodo, updateTodo, moveTodo } = useMutations();

  const { listId } = useParams({ strict: false });

  const [editorOpen, setEditorOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();

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
      className={cn(
        "flex min-h-11 items-center gap-rx-2 rounded-3 px-rx-3 py-rx-1 transition-colors ease-out sm:hover:bg-accent-3",
      )}
    >
      {editorOpen ? (
        <TodoForm
          initialValue={todo.text}
          handleSubmit={(text) => {
            updateTodo.mutate({
              id: todo.id,
              data: { text },
            });
            setEditorOpen(false);
          }}
        />
      ) : (
        <>
          <Spinner loading={updateTodo.isPending}>
            <Checkbox
              size="3"
              variant="soft"
              checked={todo.isCompleted}
              onCheckedChange={() =>
                updateTodo.mutate({
                  id: todo.id,
                  data: { isCompleted: !todo.isCompleted },
                })
              }
            />
          </Spinner>
          <Flex
            flexGrow="1"
            align="center"
            onClick={() => setEditorOpen(true)}
            className="min-w-0 whitespace-normal break-words"
          >
            <Text
              size="2"
              className={cn(todo.isCompleted && "text-gray-10 line-through")}
            >
              <TextWithLinks text={todo.text} />
            </Text>
          </Flex>
          {todo.list && todo.list.id !== listId && (
            <Badge asChild>
              <Link {...goToList(todo.list.id)}>{todo.list.name}</Link>
            </Badge>
          )}
          {!todo.isAuthor && <UserBubble user={todo.author} size="md" />}
          {isMobile ? (
            <TodoDrawer
              handleDelete={() => deleteTodo.mutate({ id: todo.id })}
              handleEdit={() => setEditorOpen(true)}
              handleMove={(listId) =>
                moveTodo.mutate({ id: todo.id, data: { listId } })
              }
            />
          ) : (
            <TodoDropdown
              handleDelete={() => deleteTodo.mutate({ id: todo.id })}
              handleEdit={() => setEditorOpen(true)}
              handleMove={(listId) =>
                moveTodo.mutate({ id: todo.id, data: { listId } })
              }
            />
          )}
        </>
      )}
    </div>
  );
};

export default Todo;
