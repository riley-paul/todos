import React from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { useLongPress } from "react-use";
import { Badge } from "./ui/badge";

type ListProps = React.PropsWithChildren<{
  link: string;
  linkLongPress?: string;
  isShared?: boolean;
}>;

const ListPill: React.FC<ListProps> = (props) => {
  const { children, link, linkLongPress, isShared } = props;
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
        {isShared && <i className="fa-solid fa-link ml-2" />}
      </Badge>
    </NavLink>
  );
};

export default ListPill;
