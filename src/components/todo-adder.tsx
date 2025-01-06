import React from "react";
import { useEventListener, useMediaQuery } from "usehooks-ts";
import useMutations from "@/hooks/use-mutations";
import useSelectedList from "@/hooks/use-selected-list";
import { Button, Flex, IconButton, Spinner, TextArea } from "@radix-ui/themes";
import { resizeTextArea } from "@/lib/resizing-textarea";
import { flushSync } from "react-dom";

const isEmptyString = (value: string) => value.trim() === "";

export default function TodoAdder(): ReturnType<React.FC> {
  const { createTodo } = useMutations();
  const { selectedList } = useSelectedList();

  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = React.useState("");

  const create = () => {
    if (value) {
      createTodo.mutate({ text: value, listId: selectedList });
      flushSync(() => setValue(""));
      resizeTextArea(inputRef.current!);
      inputRef.current?.focus();
    }
  };

  useEventListener("keydown", (e) => {
    if (e.key === "i" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      inputRef.current?.focus();
    }

    if (e.key === "Escape") {
      setValue("");
      inputRef.current?.blur();
    }
  });

  const isMobile = useMediaQuery("(max-width: 500px)");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        create();
      }}
    >
      <Flex gap="3" align="start" px="3">
        <TextArea
          autoFocus
          size="3"
          ref={inputRef}
          value={value}
          placeholder="Add a todo..."
          rows={1}
          className="min-h-min flex-1"
          onChange={(e) => {
            setValue(e.target.value);
            resizeTextArea(e.target);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              create();
            }
          }}
          onFocus={(e) => {
            e.target.select();
          }}
        />
        <input type="submit" hidden />
        {isMobile ? (
          <IconButton
            size="3"
            type="submit"
            variant="soft"
            disabled={isEmptyString(value)}
          >
            <Spinner loading={createTodo.isPending}>
              <i className="fa-solid fa-plus" />
            </Spinner>
          </IconButton>
        ) : (
          <Button
            size="3"
            type="submit"
            variant="soft"
            disabled={isEmptyString(value)}
          >
            <Spinner loading={createTodo.isPending}>
              <i className="fa-solid fa-plus" />
            </Spinner>
            Add
          </Button>
        )}
      </Flex>
    </form>
  );
}
