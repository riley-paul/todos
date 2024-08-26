import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Plus } from "lucide-react";
import useMutations from "../hooks/use-mutations";

export default function Adder(): ReturnType<React.FC> {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState<string>("");
  const { createTodo } = useMutations();

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
        onFocus={(e) => e.target.select()}
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
