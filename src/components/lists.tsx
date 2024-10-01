import { useQuery } from "@tanstack/react-query";
import React from "react";
import { listsQueryOptions } from "@/lib/queries";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { NavLink, useLocation } from "react-router-dom";
import { useLongPress } from "react-use";
import ResponsiveDialog from "@/components/ui/responsive-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ListSelect } from "@/lib/types";
import useMutations from "@/hooks/use-mutations";
import { cn } from "@/lib/utils";
import DeleteButton from "@/components/ui/delete-button";

type ListFormProps = {
  list?: ListSelect;
  onSubmit?: () => void;
};

const ListForm: React.FC<ListFormProps> = (props) => {
  const { list, onSubmit } = props;
  const { updateList, createList, deleteList } = useMutations();

  const [name, setName] = React.useState(list?.name ?? "");

  return (
    <form
      className={"grid items-start gap-4"}
      onSubmit={(e) => {
        e.preventDefault();
        if (list) {
          updateList.mutate({ id: list.id, data: { name } });
        } else {
          createList.mutate({ name });
        }
        onSubmit?.();
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="name"
          id="name"
          autoFocus
          value={name}
          placeholder="List name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" className="flex-1">
          Save changes
        </Button>
        {list && (
          <DeleteButton
            handleDelete={() => deleteList.mutate({ id: list.id })}
          />
        )}
      </div>
    </form>
  );
};

type ListProps = React.PropsWithChildren<{
  link?: string;
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
      {link ? (
        <NavLink to={link} {...longPress}>
          <Badge variant={isActive ? "default" : "secondary"} className="h-6">
            {children}
          </Badge>
        </NavLink>
      ) : (
        <button
          className={cn(badgeVariants({ variant: "secondary" }), "h-6")}
          onClick={() => setDialogOpen(true)}
        >
          {children}
        </button>
      )}

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
        <ListForm list={list} onSubmit={() => setDialogOpen(false)} />
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
      <List noEdit>
        <i className="fa-solid fa-plus" />
      </List>
    </div>
  );
};

export default Lists;
