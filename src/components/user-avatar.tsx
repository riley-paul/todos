import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getProfileQP } from "@/lib/queries";
import { Github, User } from "lucide-react";
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
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const UserAvatar: React.FC = () => {
  const profileQuery = useQuery(getProfileQP);

  if (!profileQuery.data) {
    return (
      <a className={cn(buttonVariants())} href="/api/auth/login/github">
        <Github size="1rem" className="mr-2" />
        Login with GitHub
      </a>
    );
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
