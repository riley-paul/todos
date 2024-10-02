import type { ListSelect } from "@/lib/types";
import { cn } from "@/lib/utils";
import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { useLongPress } from "react-use";
import ListForm from "./list-form";
import { Badge, badgeVariants } from "./ui/badge";
import ResponsiveDialog from "./ui/responsive-dialog";

type ListProps = React.PropsWithChildren<{
  link?: string;
  list?: ListSelect;
  noEdit?: boolean;
}>;

const ListPill: React.FC<ListProps> = (props) => {
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
            {list && list.shares.length > 0 && (
              <i className="fa-solid fa-link ml-2" />
            )}
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

export default ListPill;
