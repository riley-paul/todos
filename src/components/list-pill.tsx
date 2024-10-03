import React from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { useLongPress } from "react-use";
import { Badge } from "./ui/badge";
import type { UserSelect } from "@/lib/types";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ListProps = React.PropsWithChildren<{
  link: string;
  linkLongPress?: string;
  isShared?: boolean;
  isAdmin?: boolean;
  listAdmin?: UserSelect | null;
}>;

const ListPill: React.FC<ListProps> = (props) => {
  const { children, link, linkLongPress, isShared, listAdmin } = props;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = pathname === link;

  const longPress = useLongPress(
    () => {
      if (linkLongPress) {
        navigate(linkLongPress);
      }
    },
    { isPreventDefault: true },
  );

  return (
    <NavLink to={link} {...longPress}>
      <Badge variant={isActive ? "default" : "secondary"} className="h-6">
        {children}
        {isShared && (
          <Tooltip>
            <TooltipTrigger>
              <i className="fa-solid fa-link ml-2" />
            </TooltipTrigger>
            {listAdmin && (
              <TooltipContent>Shared by {listAdmin.name}</TooltipContent>
            )}
          </Tooltip>
        )}
      </Badge>
    </NavLink>
  );
};

export default ListPill;
