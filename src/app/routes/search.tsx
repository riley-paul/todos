import { Card, IconButton, TextField } from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Command } from "cmdk";
import { SearchIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { qTodoSearch } from "../lib/queries";

export const Route = createFileRoute("/search")({
  component: RouteComponent,
});

function RouteComponent() {
  const [value, setValue] = useState("");
  const { data: todos } = useSuspenseQuery(qTodoSearch(""));

  return (
    <React.Fragment>
      <Command className="flex flex-1 flex-col gap-6">
        <Command.Input asChild value={value} onValueChange={setValue}>
          <TextField.Root size="3" placeholder="Search...">
            <TextField.Slot side="left">
              <SearchIcon className="text-accent-10 size-4" />
            </TextField.Slot>
            <TextField.Slot side="right">
              {value.length > 0 && (
                <IconButton variant="ghost" size="2" color="red">
                  <XIcon className="size-4" />
                </IconButton>
              )}
            </TextField.Slot>
          </TextField.Root>
        </Command.Input>
        <Command.List>
          {todos.map((todo) => (
            <Command.Item key={todo.id} value={`${todo.id}-${todo.text}`}>
              {todo.text}
            </Command.Item>
          ))}
        </Command.List>
      </Command>
    </React.Fragment>
  );
}
