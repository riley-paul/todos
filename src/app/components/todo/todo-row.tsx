import { cn } from "@/app/lib/utils";
import type { TodoSelect } from "@/lib/types";
import React from "react";
import TextWithLinks from "../ui/text-with-links";
import { Badge, Text } from "@radix-ui/themes";

type Props = { todo: TodoSelect };

const TodoRow: React.FC<Props> = ({ todo }) => {
  return (
    <article className="flex flex-1 items-center justify-between gap-4">
      <Text
        size="2"
        className={cn(todo.isCompleted && "line-through opacity-50")}
      >
        <TextWithLinks text={todo.text} />
      </Text>
      <Badge>{todo.list.name}</Badge>
    </article>
  );
};

export default TodoRow;
