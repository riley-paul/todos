import React from "react";

import { Avatar, IconButton, Text } from "@radix-ui/themes";
import useMutations from "@/app/hooks/use-mutations";
import { LogOutIcon, Settings2Icon, TrashIcon } from "lucide-react";
import { useAtom } from "jotai";
import { alertSystemAtom } from "./alert-system/alert-system.store";
import { linkOptions } from "@tanstack/react-router";
import type { MenuItem } from "./ui/menu/menu.types";
import ResponsiveMenu from "./ui/menu/responsive-menu";
import type { UserSelect } from "@/lib/types";

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

  const fallback = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const menuItems: MenuItem[] = [
    {
      type: "custom",
      component: (
        <header key="user-info" className="flex items-center gap-2 p-2">
          <Avatar
            src={user.avatarUrl ?? ""}
            alt={user.name}
            fallback={fallback}
            radius="full"
          />
          <div className="grid flex-1 leading-0.5">
            <Text weight="medium" truncate>
              {user.name}
            </Text>
            <Text color="gray" size="2">
              {user.email}
            </Text>
          </div>
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
        <Avatar
          size="3"
          radius="full"
          src={user.avatarUrl ?? ""}
          fallback={fallback}
          className="cursor-pointer"
        />
      </IconButton>
    </ResponsiveMenu>
  );
};

export default UserMenu;
