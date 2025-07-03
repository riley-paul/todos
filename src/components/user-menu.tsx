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
import { Link } from "@tanstack/react-router";

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

  return (
    <DropdownMenu.Root>
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
      <DropdownMenu.Content side="right" className="grid gap-3">
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
        <DropdownMenu.Separator />
        <DropdownMenu.Item asChild>
          <Link to="/settings">
            <Settings2Icon className="size-4 opacity-70" />
            <span>Settings</span>
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <a href="/logout">
            <LogOutIcon className="size-4 opacity-70" />
            <span>Log out</span>
          </a>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item color="red" onClick={handleDeleteAccount}>
          <TrashIcon className="size-4 opacity-70" />
          <span>Delete Account</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default UserMenu;
