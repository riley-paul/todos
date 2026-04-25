import React from "react";
import { useEventListener } from "usehooks-ts";
import { Button, Spinner, TextArea } from "@radix-ui/themes";
import { resizeTextArea } from "@/app/lib/utils";
import { flushSync } from "react-dom";
import { z } from "astro/zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mergeRefs } from "@/app/lib/utils";
import { PlusIcon } from "lucide-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useCreateTodoMutation } from "../gql";

const schema = z.object({
  text: z.string().nonempty("Todo text cannot be empty"),
});
type Schema = z.infer<typeof schema>;

const TodoAdder: React.FC<{ listId: string }> = ({ listId }) => {
  const [createTodo, { loading }] = useCreateTodoMutation({
    optimisticResponse: ({ input: { text } }) => {
      return {
        __typename: "Mutation",
        createTodo: {
          __typename: "TodoObjectType",
          id: `temp-id-${Math.random()}`,
          text,
          isCompleted: false,
          isAuthor: true,
          author: {
            __typename: "UserObjectType",
            id: "current-user-id",
            name: "Current User",
            email: "",
          },
          list: { __typename: "ListObjectType", id: listId, name: "" },
        },
      };
    },
    update: (cache, { data }) => {
      if (!data?.createTodo) return;

      const newTodo = data.createTodo;
      const cacheId = cache.identify(newTodo);
      cache.modify({
        id: cache.identify({ __typename: "ListObjectType", id: listId }),
        fields: {
          todos(existingRefs = []) {
            const newRef = { __ref: cacheId };
            return [newRef, ...existingRefs];
          },
        },
      });
    },
  });

  const { control, handleSubmit, reset } = useForm<Schema>({
    resolver: zodResolver(schema),
    values: { text: "" },
  });

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const resetInput = () => {
    flushSync(() => reset());
    resizeTextArea(inputRef.current);
  };

  const onSubmit = handleSubmit(({ text }) => {
    createTodo({ variables: { input: { text, listId } } });
    resetInput();
  });

  useEventListener("resize", () => {
    resizeTextArea(inputRef.current);
  });

  useHotkey(
    "Escape",
    () => {
      resetInput();
      inputRef.current?.blur();
    },
    { target: inputRef },
  );

  useHotkey("L", () => inputRef.current?.focus(), { ignoreInputs: true });

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Controller
        control={control}
        name="text"
        render={({ field }) => (
          <div className="grid flex-1 gap-1">
            <TextArea
              size="3"
              placeholder="Add a todo..."
              rows={1}
              className="min-h-min overflow-hidden"
              {...field}
              ref={mergeRefs([field.ref, inputRef])}
              onChange={(e) => {
                field.onChange(e);
                resizeTextArea(e.target);
              }}
              onFocus={(e) => {
                e.target.select();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSubmit();
                }
              }}
            />
          </div>
        )}
      />

      <input type="submit" hidden />

      <Button size="3" type="submit" className="px-3 sm:px-5">
        <Spinner loading={loading}>
          <PlusIcon className="size-5" />
        </Spinner>
        <span className="hidden sm:block">Add</span>
      </Button>
    </form>
  );
};

export default TodoAdder;
