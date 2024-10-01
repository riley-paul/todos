import { useQuery } from "@tanstack/react-query";
import React from "react";
import { listsQueryOptions } from "../lib/queries";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { NavLink, useLocation } from "react-router-dom";
import { useLongPress } from "react-use";
import ResponsiveDialog from "./responsive-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { ListSelect } from "@/lib/types";

type ListProps = React.PropsWithChildren<{
  link: string;
  list?: ListSelect;
  noEdit?: boolean;
}>;

const List: React.FC<ListProps> = (props) => {
  const { children, link, list, noEdit } = props;
  const { pathname } = useLocation();
  const isActive = pathname === link;

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const longPress = useLongPress(
    () => {
      if (noEdit) return;
      setDialogOpen(true);
    },
    { isPreventDefault: true },
  );

  return (
    <>
      <NavLink to={link} {...longPress}>
        <Badge variant={isActive ? "default" : "secondary"} className="h-6">
          {children}
        </Badge>
      </NavLink>
      <ResponsiveDialog
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
        title={list ? `Edit ${list.name}` : "Add list"}
        description={
          list
            ? "Update list name and share with other users"
            : "Create a new list to organize your tasks"
        }
      >
        <form
          className={"grid items-start gap-4"}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" defaultValue="shadcn@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue="@shadcn" />
          </div>
          <Button type="submit">Save changes</Button>
        </form>
      </ResponsiveDialog>
    </>
  );
};

const Lists: React.FC = () => {
  const listsQuery = useQuery(listsQueryOptions);
  const lists = listsQuery.data ?? [];

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-3">
      <List link="/" noEdit>
        Inbox
      </List>
      <List link="/all" noEdit>
        All
      </List>
      <Separator orientation="vertical" className="h-6" />
      {lists.map((list) => (
        <List key={list.id} link={`/list/${list.id}`} list={list}>
          {list.name}
        </List>
      ))}
      <List link="/list/add" noEdit>
        <i className="fa-solid fa-plus" />
      </List>
    </div>
  );
};

export default Lists;
