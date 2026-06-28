import { Text } from "@radix-ui/themes";
import { HourglassIcon } from "lucide-react";
import React from "react";
import UserBubbleGroup from "../ui/user/user-bubble-group";
import { cn } from "@/app/lib/utils";
import type { ShallowListFragment } from "@/app/gql.gen";
import useNonPendingListUsers from "@/app/hooks/actions/use-non-pending-list-users";

type Props = { list: ShallowListFragment };

const ListRow: React.FC<Props> = ({ list }) => {
  const nonPendingUsers = useNonPendingListUsers(list);
  return (
    <article className="flex flex-1 items-center gap-4">
      <Text
        size="2"
        className={cn("flex flex-1 gap-2", list.isPending && "opacity-50")}
      >
        <span>{list.name}</span>
        <span className="font-mono opacity-70">{list.todoCount}</span>
      </Text>
      <section className="flex items-center gap-2">
        {list.isPending && <HourglassIcon className="text-amber-10 size-4" />}
        <UserBubbleGroup users={nonPendingUsers} />
      </section>
    </article>
  );
};

export default ListRow;
