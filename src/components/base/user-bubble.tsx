import type { UserSelect } from "@/lib/types";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  user: UserSelect;
};

const UserBubble: React.FC<Props> = (props) => {
  const { user } = props;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Avatar className="size-5">
          <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent side="right">{user.name}</TooltipContent>
    </Tooltip>
  );
};

export default UserBubble;
