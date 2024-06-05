import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api, client } from "@/lib/client";
import { todosQueryOptions } from "@/lib/queries";
import { type TodoInsert } from "@/api/db/schema";

export default function Adder(): ReturnType<React.FC> {
  const [value, setValue] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const createMutation = useMutation(
    {
      mutationFn: (data: Omit<TodoInsert, "userId">) =>
        api.todos.$post({ json: data }),
      onSuccess: async () => {
        await client.invalidateQueries({
          queryKey: todosQueryOptions.queryKey,
        });
      },
    },
    client,
  );

  const create = () => {
    if (value) {
      createMutation.mutate({ text: value });
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
        {createMutation.isPending ? (
          <Loader2 size="1.2rem" className="mr-2 animate-spin" />
        ) : (
          <Plus size="1.2rem" className="mr-2" />
        )}
        Add
      </Button>
    </div>
  );
}
