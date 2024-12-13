import React from "react";
import { useEventListener, useMediaQuery } from "usehooks-ts";
import useMutations from "@/hooks/use-mutations";
import useSelectedList from "@/hooks/use-selected-list";
import { Button, Spinner, TextField } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";

const isOnlyHashtag = (value: string) =>
  value.startsWith("#") && value.trim().split(" ").length === 1;

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
        if (isEmptyString(value) || isOnlyHashtag(value)) return;
        create();
      }}
      className="flex items-center gap-2 px-3"
    >
      <TextField.Root
        autoFocus
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a todo..."
        onFocus={(e) => {
          if (!isOnlyHashtag(value)) {
            e.target.select();
          }
        }}
        className="flex-1"
      />
      <input type="submit" hidden />
      <Button
        type="submit"
        className="shrink-0"
        disabled={isEmptyString(value) || isOnlyHashtag(value)}
      >
        {createTodo.isPending ? <Spinner /> : <PlusIcon />}
        {!isMobile && <span>Add</span>}
      </Button>
    </form>
  );
}
