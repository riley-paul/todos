import React, { useEffect } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import UserBubble from "@/app/components/ui/user/user-bubble";
import {
  Badge,
  Button,
  Checkbox,
  Flex,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { cn } from "@/app/lib/utils";
import { focusInputAtEnd, resizeTextArea } from "@/app/lib/utils";
import TextWithLinks from "../ui/text-with-links";
import TodoMenu from "./todo-menu";
import {
  Link,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { useAtom } from "jotai";
import { editingTodoIdAtom } from "./todos.store";
import { SaveIcon } from "lucide-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import type { TodoSelectDetails } from "@/lib/types2";
import { useUser } from "@/app/providers/user-provider";
import * as collections from "@/app/lib/collections";

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

const Todo: React.FC<{ todo: TodoSelectDetails }> = ({ todo }) => {
  const { listId } = useParams({ strict: false });
  const navigate = useNavigate();
  const user = useUser();

  const isAuthor = user.id === todo.userId;

  const [editingTodoId, setEditingTodoId] = useAtom(editingTodoIdAtom);
  const isEditing = editingTodoId === todo.id;

  const ref = React.useRef<HTMLDivElement>(null);

  const { highlightedTodoId } = useSearch({ strict: false });
  const isHighlighted = highlightedTodoId === todo.id;

  useOnClickOutside(ref, () => {
    if (isEditing) setEditingTodoId(null);
    if (isHighlighted) navigate({ search: undefined });
  });

  useHotkey(
    "Escape",
    () => {
      if (isEditing) setEditingTodoId(null);
      if (isHighlighted) navigate({ search: undefined });
    },
    { conflictBehavior: "allow" },
  );

  useEffect(() => {
    if (isHighlighted)
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [isHighlighted]);

  return (
    <div
      ref={ref}
      className={cn(
        (isHighlighted || isEditing) && "bg-accent-3",
        "xs:hover:bg-accent-3",
        "rounded-3 -mx-3 flex min-h-11 items-center gap-2 px-3 py-1 transition-colors ease-in",
      )}
    >
      {isEditing ? (
        <TodoForm
          initialValue={todo.text}
          handleSubmit={(text) => {
            collections.todos.update(todo.id, (draft) => {
              draft.text = text;
            });
            setEditingTodoId(null);
          }}
        />
      ) : (
        <>
          <Checkbox
            size="3"
            variant="soft"
            checked={todo.isCompleted}
            onCheckedChange={() =>
              collections.todos.update(todo.id, (draft) => {
                draft.isCompleted = !todo.isCompleted;
              })
            }
          />
          <Flex
            flexGrow="1"
            align="center"
            onClick={() => setEditingTodoId(todo.id)}
            className="min-w-0 wrap-break-word whitespace-normal"
          >
            <Text
              size="2"
              className={cn(todo.isCompleted && "line-through opacity-50")}
            >
              <TextWithLinks text={todo.text} />
            </Text>
          </Flex>
          {todo.list && todo.list.id !== listId && (
            <Badge asChild>
              <Link to="/todos/$listId" params={{ listId: todo.list.id }}>
                {todo.list.name}
              </Link>
            </Badge>
          )}
          {!isAuthor && (
            <UserBubble user={todo.author} avatarProps={{ size: "1" }} />
          )}
          <TodoMenu todoId={todo.id} />
        </>
      )}
    </div>
  );
};

export default Todo;
