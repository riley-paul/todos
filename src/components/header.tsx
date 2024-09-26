import { CircleCheckBig } from "lucide-react";
import React from "react";
import { cn } from "../lib/utils";
import UserAvatar from "./user-avatar";
import { Link, NavLink } from "react-router-dom";
import { buttonVariants } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { sharedTagsQueryOptions } from "@/lib/queries";
import { Badge } from "./ui/badge";

const Header: React.FC = () => {
  const { data } = useQuery(sharedTagsQueryOptions);
  const pendingSharedTagsCount =
    data?.sharedToUser.filter((i) => i.SharedTag.isPending).length ?? 0;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 shrink-0 border-b bg-background/30 backdrop-blur",
      )}
    >
      <div className="container2 flex h-full items-center justify-between px-5">
        <Link to="/">
          <div className="flex items-center gap-2">
            <CircleCheckBig size="1.5rem" className="text-primary" />
            <div className="text-2xl font-bold">Todos</div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <NavLink
            to="/shared"
            className={({ isActive }) =>
              cn(
                "gap-2",
                buttonVariants({
                  variant: isActive ? "secondary" : "ghost",
                  size: "sm",
                }),
              )
            }
          >
            <i className="fa-solid fa-share" />
            <span>Shared</span>
            {pendingSharedTagsCount > 0 && (
              <Badge variant="secondary">{pendingSharedTagsCount}</Badge>
            )}
          </NavLink>
          <UserAvatar />
        </div>
      </div>
    </header>
  );
};

export default Header;
