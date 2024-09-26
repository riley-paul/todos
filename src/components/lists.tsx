import { useQuery } from "@tanstack/react-query";
import React from "react";
import { listsQueryOptions } from "../lib/queries";
import { Badge, badgeVariants } from "./ui/badge";
import { Separator } from "./ui/separator";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useLongPress } from "react-use";

const List: React.FC<{ name: string; link: string; noEdit?: boolean }> = ({
  name,
  link,
  noEdit,
}) => {
  const navigate = useNavigate();
  const longPress = useLongPress(
    () => {
      if (noEdit) return;
      navigate(`${link}/edit`);
    },
    { isPreventDefault: true },
  );

  return (
    <NavLink
      to={link}
      {...longPress}
      className={({ isActive }) =>
        badgeVariants({ variant: isActive ? "default" : "secondary" })
      }
    >
      {name}
    </NavLink>
  );
};

const Lists: React.FC = () => {
  const listsQuery = useQuery(listsQueryOptions);
  const lists = listsQuery.data ?? [];

  return (
    <div className="flex flex-wrap gap-1.5 px-3">
      <List name="Inbox" link="/" noEdit />
      <List name="All" link="/all" noEdit />
      <Separator orientation="vertical" />
      {lists.map((list) => (
        <List key={list.id} name={list.name} link={`/list/${list.id}`} />
      ))}
      <Badge variant="secondary">
        <Plus className="size-4" />
      </Badge>
    </div>
  );
};

export default Lists;
