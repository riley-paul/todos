import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useMutations from "../hooks/use-mutations";
import { useEventListener, useMediaQuery } from "usehooks-ts";
import useSelectedList from "@/hooks/use-selected-list";

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
      <Input
        autoFocus
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-md h-10 px-4"
        placeholder="Add a todo..."
        onFocus={(e) => {
          if (!isOnlyHashtag(value)) {
            e.target.select();
          }
        }}
      />
      <input type="submit" hidden />
      <Button
        type="submit"
        size={isMobile ? "icon" : "default"}
        className="shrink-0"
        disabled={isEmptyString(value) || isOnlyHashtag(value)}
      >
        {createTodo.isPending ? (
          <i className="fa-solid fa-circle-nodes animate-spin" />
        ) : (
          <i className="fa-solid fa-plus" />
        )}
        {!isMobile && <span className="ml-2">Add</span>}
      </Button>
    </form>
  );
}
