import React from "react";
import { useEventListener, useMediaQuery } from "usehooks-ts";
import useMutations from "@/hooks/use-mutations";
import useSelectedList from "@/hooks/use-selected-list";
import { Button, Flex, IconButton, Spinner, TextField } from "@radix-ui/themes";
import { Plus } from "lucide-react";

const isEmptyString = (value: string) => value.trim() === "";

export default function Adder(): ReturnType<React.FC> {
  const { createTodo } = useMutations();
  const { selectedList } = useSelectedList();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState("");

  const create = () => {
    if (value) {
      createTodo.mutate({ data: { text: value, listId: selectedList } });
      setValue("");
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
        if (isEmptyString(value)) return;
        create();
      }}
    >
      <Flex gap="3" align="center" px="3">
        <TextField.Root
          autoFocus
          size="3"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a todo..."
          onFocus={(e) => {
            e.target.select();
          }}
          className="flex-1"
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
              <Plus className="size-5" />
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
              <Plus className="size-5" />
            </Spinner>
            Add
          </Button>
        )}
      </Flex>
    </form>
  );
}
