import React from "react";

import LoginButton from "./login-button";
import { useQuery } from "@tanstack/react-query";
import { qUser } from "@/lib/client/queries";
import { Avatar, DropdownMenu, Spinner, Text, Tooltip } from "@radix-ui/themes";
import useMutations from "@/hooks/use-mutations";
import {
  LogOutIcon,
  Settings2Icon,
  TrashIcon,
  TriangleAlert,
} from "lucide-react";
import { useAtom } from "jotai";
import { alertSystemAtom } from "./alert-system/alert-system.store";
import { linkOptions } from "@tanstack/react-router";
import type { MenuItem } from "./ui/menu/types";
import MenuDropdown from "./ui/menu/menu-dropdown";

const UserMenu: React.FC = () => {
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

  const userQuery = useQuery(qUser);

  if (userQuery.isLoading) {
    return <Avatar size="3" radius="full" src="" fallback={<Spinner />} />;
  }

  if (userQuery.isError) {
    return (
      <Tooltip content="Error loading user data" side="left">
        <div>
          <Avatar
            size="3"
            radius="full"
            src=""
            color="red"
            fallback={<TriangleAlert className="size-4" />}
          />
        </div>
      </Tooltip>
    );
  }

  const user = userQuery.data;

  if (!user) {
    return (
      <span className="flex gap-1">
        <LoginButton provider="github" />
        <LoginButton provider="google" />
      </span>
    );
  }

  const fallback = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const menuItems: MenuItem[] = [
    { type: "separator" },
    {
      type: "item",
      key: "settings",
      text: "Settings",
      icon: <Settings2Icon className="size-4 opacity-70" />,
      linkOptions: linkOptions({ to: "/settings" }),
    },
    {
      type: "item",
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
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger title="User settings">
        <button>
          <Avatar
            size="3"
            radius="full"
            src={user.avatarUrl ?? ""}
            fallback={fallback}
            className="cursor-pointer"
          />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="grid gap-3">
        <header className="flex items-center gap-2 p-2">
          <Avatar
            src={user.avatarUrl ?? ""}
            alt={user.name}
            fallback={fallback}
            radius="full"
          />
          <div className="leading-0.5 grid flex-1">
            <Text weight="medium" truncate>
              {user.name}
            </Text>
            <Text color="gray" size="2">
              {user.email}
            </Text>
          </div>
        </header>
        <MenuDropdown menuItems={menuItems} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default UserMenu;
