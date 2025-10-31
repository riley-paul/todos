import React from "react";

import { IconButton } from "@radix-ui/themes";
import useMutations from "@/app/hooks/use-mutations";
import { LogOutIcon, Settings2Icon, TrashIcon } from "lucide-react";
import { useAtom } from "jotai";
import { alertSystemAtom } from "./alert-system/alert-system.store";
import { linkOptions } from "@tanstack/react-router";
import type { MenuItem } from "./ui/menu/menu.types";
import ResponsiveMenu from "./ui/menu/responsive-menu";
import type { UserSelect } from "@/lib/types";
import UserRow from "./ui/user/user-row";
import UserBubble from "./ui/user/user-bubble";

const UserMenu: React.FC<{ user: UserSelect }> = ({ user }) => {
  const { deleteUser } = useMutations();
  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const handleDeleteAccount = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Delete Account",
        message:
          "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
        handleDelete: () => {
          deleteUser.mutate({});
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  const menuItems: MenuItem[] = [
    {
      type: "custom",
      component: (
        <header key="user-info" className="p-2">
          <UserRow user={user} isLarge />
        </header>
      ),
    },
    { type: "separator" },
    {
      type: "link",
      key: "settings",
      text: "Settings",
      icon: <Settings2Icon className="size-4 opacity-70" />,
      linkOptions: linkOptions({ to: "/settings" }),
    },
    {
      type: "anchor",
      key: "logout",
      text: "Log out",
      icon: <LogOutIcon className="size-4 opacity-70" />,
      anchorOptions: { href: "/logout" },
    },
    { type: "separator" },
    {
      type: "item",
      key: "delete-account",
      text: "Delete Account",
      icon: <TrashIcon className="size-4 opacity-70" />,
      color: "red",
      onClick: handleDeleteAccount,
    },
  ];

  return (
    <ResponsiveMenu
      menuItems={menuItems}
      dropdownProps={{ className: "min-w-48", align: "end" }}
    >
      <IconButton size="1" variant="ghost" radius="full">
        <UserBubble user={user} avatarProps={{ size: "3" }} />
      </IconButton>
    </ResponsiveMenu>
  );
};

export default UserMenu;
