import { useQuery } from "@tanstack/react-query";
import React from "react";
import { listsQueryOptions } from "../lib/queries";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Link, useLocation } from "react-router-dom";

const List: React.FC<{ name: string; link: string }> = ({ name, link }) => {
  const { pathname } = useLocation();

  const isActive = link === pathname;
  return (
    <Link to={link}>
      <Badge variant={isActive ? "default" : "secondary"}>{name}</Badge>
    </Link>
  );
};

const Lists: React.FC = () => {
  const listsQuery = useQuery(listsQueryOptions);
  const lists = listsQuery.data ?? [];

  return (
    <div className="flex flex-wrap gap-1.5 px-3">
      <List name="Inbox" link="/" />
      <List name="All" link="/all" />
      <Separator orientation="vertical" />
      {lists.map((list) => (
        <List key={list.id} name={list.name} link={`/list/${list.id}`} />
      ))}
    </div>
  );
};

export default Lists;
