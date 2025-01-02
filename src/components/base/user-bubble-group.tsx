import type { UserSelect } from "@/lib/types";
import React from "react";
import { Avatar } from "@radix-ui/themes";
import UserBubble from "./user-bubble";

type Props = {
  users: UserSelect[];
  numAvatars?: number;
};

const UserBubbleGroup: React.FC<Props> = ({ users, numAvatars = 3 }) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap-reverse pl-rx-1">
      {users.slice(0, numAvatars).map((user) => (
        <div key={user.id} className="-ml-rx-1">
          <UserBubble user={user} size="sm" />
        </div>
      ))}
      {users.length > numAvatars && (
        <Avatar
          src=""
          variant="solid"
          fallback={`+${users.length - numAvatars}`}
          radius="full"
          className="-ml-rx-1 h-4 text-1"
          size="1"
        />
      )}
    </div>
  );
};

export default UserBubbleGroup;
