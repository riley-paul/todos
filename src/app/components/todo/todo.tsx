import React, { useEffect } from "react";
import useMutations from "@/app/hooks/use-mutations";
import type { TodoSelect } from "@/lib/types";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import UserBubble from "../ui/user-bubble";
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
import { focusInputAtEnd, resizeTextArea } from "@/lib/client/utils";
import TextWithLinks from "../ui/text-with-links";
import TodoMenu from "./todo-menu";
import {
  Link,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { goToList } from "@/lib/client/links";
import { useAtom } from "jotai";
import { editingTodoIdAtom } from "./todos.store";
import { SaveIcon } from "lucide-react";

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
    ref.current?.focus();
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
        <SaveIcon className="size-4" />
        Save
      </Button>
    </form>
  );
};

const Todo: React.FC<{ todo: TodoSelect }> = ({ todo }) => {
  const { listId } = useParams({ strict: false });
  const { updateTodo } = useMutations();
  const navigate = useNavigate();

  const [editingTodoId, setEditingTodoId] = useAtom(editingTodoIdAtom);
  const isEditing = editingTodoId === todo.id;

  const ref = React.useRef<HTMLDivElement>(null);

  const { highlightedTodoId } = useSearch({ strict: false });
  const isHighlighted = highlightedTodoId === todo.id;

  useOnClickOutside(ref, () => {
    if (isEditing) setEditingTodoId(null);
    if (isHighlighted) navigate({ search: undefined });
  });

  useEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (isEditing) setEditingTodoId(null);
      if (isHighlighted) navigate({ search: undefined });
    }
  });

  useEffect(() => {
    if (isHighlighted)
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [isHighlighted]);

  return (
    <div
      ref={ref}
      className={cn(
        (isHighlighted || isEditing) && "bg-accent-2",
        "sm:hover:bg-accent-2 -mx-4 flex min-h-11 items-center gap-2 px-4 py-1 transition-colors ease-out",
      )}
    >
      {isEditing ? (
        <TodoForm
          initialValue={todo.text}
          handleSubmit={(text) => {
            updateTodo.mutate({
              id: todo.id,
              data: { text },
            });
            setEditingTodoId(null);
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
            onClick={() => setEditingTodoId(todo.id)}
            className="min-w-0 break-words whitespace-normal"
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
          {!todo.isAuthor && (
            <UserBubble user={todo.author} avatarProps={{ size: "1" }} />
          )}
          <TodoMenu todoId={todo.id} />
        </>
      )}
    </div>
  );
};

export default Todo;
