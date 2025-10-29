import type { ListSelect } from "@/lib/types";
import { Text } from "@radix-ui/themes";
import { HourglassIcon } from "lucide-react";
import React from "react";
import UserBubbleGroup from "../ui/user-bubble-group";
import { cn } from "@/app/lib/utils";

type Props = { list: ListSelect };

const ListRow: React.FC<Props> = ({ list }) => {
  return (
    <article className="flex flex-1 items-center gap-4">
      <Text
        size="3"
        weight="medium"
        className={cn("flex flex-1 gap-2", list.isPending && "opacity-50")}
      >
        <span>{list.name}</span>
        <span className="font-mono opacity-70">{list.todoCount}</span>
      </Text>
      <section className="flex items-center gap-2">
        {list.isPending && <HourglassIcon className="text-amber-10 size-4" />}
        <UserBubbleGroup users={list.otherUsers} />
      </section>
    </article>
  );
};

export default ListRow;
