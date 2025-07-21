import React from "react";
import { useEventListener } from "usehooks-ts";
import useMutations from "@/hooks/use-mutations";
import { Button, Spinner, Text, TextArea } from "@radix-ui/themes";
import { resizeTextArea } from "@/lib/client/utils";
import { flushSync } from "react-dom";
import type { SelectedList } from "@/lib/types";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mergeRefs } from "@/lib/client/utils";
import { PlusIcon } from "lucide-react";

const schema = z.object({
  text: z.string().nonempty("Todo text cannot be empty"),
});
type Schema = z.infer<typeof schema>;

const TodoAdder: React.FC<{ listId: SelectedList }> = ({ listId }) => {
  const { createTodo } = useMutations();

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
    createTodo.mutate({ data: { text, listId } });
    resetInput();
  });

  useEventListener("resize", () => {
    resizeTextArea(inputRef.current);
  });

  useEventListener("keydown", (e) => {
    if (e.key === "i" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      inputRef.current?.focus();
    }

    if (e.key === "Escape") {
      resetInput();
      inputRef.current?.blur();
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex gap-2 px-3">
      <Controller
        control={control}
        name="text"
        render={({ field, fieldState: { error } }) => (
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
            {error && (
              <Text size="1" color="red" ml="1">
                {error?.message}
              </Text>
            )}
          </div>
        )}
      />

      <input type="submit" hidden />

      <Button size="3" type="submit" variant="soft" className="px-3 sm:px-5">
        <Spinner loading={createTodo.isPending}>
          <PlusIcon className="size-5" />
        </Spinner>
        <span className="hidden sm:block">Add</span>
      </Button>
    </form>
  );
};

export default TodoAdder;
