import React from "react";
import { Avatar } from "@radix-ui/themes";
import UserBubble from "./user-bubble";
import type { UserFragment } from "@/app/gql";

type Props = {
  users: UserFragment[];
  numAvatars?: number;
};

const UserBubbleGroup: React.FC<Props> = ({ users, numAvatars = 3 }) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="pl-rx-1 flex flex-wrap-reverse items-center">
      {users.slice(0, numAvatars).map((user) => (
        <div key={user.id} className="-ml-rx-1 flex items-center">
          <UserBubble user={user} avatarProps={{ size: "1" }} />
        </div>
      ))}
      {users.length > numAvatars && (
        <Avatar
          src=""
          alt={`+${users.length - numAvatars}`}
          variant="solid"
          fallback={`+${users.length - numAvatars}`}
          radius="full"
          className="-ml-rx-1 text-1 h-4"
          size="1"
        />
      )}
    </div>
  );
};

export default UserBubbleGroup;
