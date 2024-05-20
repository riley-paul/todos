import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/app/lib/utils";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import type { User } from "@/api/db/schema";

interface Props {
  user: User | null;
}

const UserAvatar: React.FC<Props> = ({ user }) => {
  if (!user) {
    return (
      <a className={cn(buttonVariants())} href="/api/auth/login/github">
        <GitHubLogoIcon className="mr-2" />
        Login with GitHub
      </a>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={user.avatarUrl ?? ""} />
          <AvatarFallback>
            <UserIcon />
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
