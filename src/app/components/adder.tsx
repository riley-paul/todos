import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Plus } from "lucide-react";
import useMutations from "../hooks/use-mutations";
import { useSearch } from "@tanstack/react-router";

const isOnlyHashtag = (value: string) =>
  value.startsWith("#") && value.split(" ").length === 1;

const isEmptyString = (value: string) => value.trim() === "";

export default function Adder(): ReturnType<React.FC> {
  const { tag } = useSearch({ from: "/_app/" });

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState<string>("");
  const { createTodo } = useMutations();

  React.useEffect(() => {
    if (tag && (isOnlyHashtag(value) || isEmptyString(value))) {
      setValue(tag === "~" ? "" : `#${tag}`);
    }
  }, [tag]);

  const create = () => {
    if (value) {
      createTodo.mutate({ data: { text: value } });
      setValue("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        autoFocus
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-md px-4"
        placeholder="Add a todo..."
        onFocus={(e) => {
          if (!isOnlyHashtag(value)) {
            e.target.select();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            create();
          }
        }}
      />
      <Button onClick={create} disabled={!value}>
        {createTodo.isPending ? (
          <Loader2 size="1.2rem" className="mr-2 animate-spin" />
        ) : (
          <Plus size="1.2rem" className="mr-2" />
        )}
        Add
      </Button>
    </div>
  );
}
