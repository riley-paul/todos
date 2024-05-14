import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getProfileQP } from "@/lib/queries";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

const UserAvatar: React.FC = () => {
  const profileQuery = useQuery(getProfileQP);

  if (!profileQuery.data) {
    return <a href="/api/login/github">Login with GitHub</a>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={profileQuery.data.avatarUrl ?? ""} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <form action="/api/auth/logout" method="POST">
          <Button type="submit" variant="outline">
            Logout
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
