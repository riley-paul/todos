import type { UserSelect } from "@/lib/types";
import React from "react";
import UserBubble from "./user-bubble";
import { Text } from "@radix-ui/themes";
import { cn } from "@/app/lib/utils";

type Props = { user: UserSelect; className?: string; isLarge?: boolean };

const UserRow: React.FC<Props> = ({ user, className, isLarge }) => {
  return (
    <article className={cn("flex items-center gap-2", className)}>
      <UserBubble avatarProps={{ size: isLarge ? "3" : "2" }} user={user} />
      <section className="grid flex-1 leading-tight">
        <Text size={isLarge ? "3" : "2"} weight="medium">
          {user.name}
        </Text>
        <Text size={isLarge ? "2" : "1"} color="gray">
          {user.email}
        </Text>
      </section>
    </article>
  );
};

export default UserRow;
