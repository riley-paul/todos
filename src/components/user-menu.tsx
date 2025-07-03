import React from "react";

import LoginButton from "./login-button";
import { useQuery } from "@tanstack/react-query";
import { qUser } from "@/lib/client/queries";
import {
  Avatar,
  Button,
  Popover,
  Spinner,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import useMutations from "@/hooks/use-mutations";
import { LogOutIcon, TrashIcon, TriangleAlert } from "lucide-react";
import { useAtom } from "jotai";
import { alertSystemAtom } from "./alert-system/alert-system.store";

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

  return (
    <Popover.Root>
      <Popover.Trigger title="User settings">
        <button>
          <Avatar
            size="3"
            radius="full"
            src={user.avatarUrl ?? ""}
            fallback={user.name[0].toUpperCase()}
            className="cursor-pointer"
          />
        </button>
      </Popover.Trigger>
      <Popover.Content align="end">
        <div className="grid gap-rx-4">
          <div className="align-center flex gap-rx-4">
            <Avatar
              size="5"
              radius="full"
              src={user.avatarUrl ?? ""}
              fallback={user.name[0].toUpperCase()}
            />
            <div className="flex flex-col justify-center">
              <Text weight="bold" size="4">
                {user.name}
              </Text>
              <Text size="2" color="gray">
                {user.email}
              </Text>
            </div>
          </div>

          <div className="grid gap-2">
            <Button asChild className="relative" variant="soft">
              <a href="/logout">
                <LogOutIcon className="absolute left-4 size-4" />
                <span>Logout</span>
              </a>
            </Button>
            <Button
              color="red"
              variant="soft"
              size="2"
              onClick={handleDeleteAccount}
              className="relative"
            >
              <TrashIcon className="size-4 absolute left-4" />
              <span>Delete Account</span>
            </Button>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default UserMenu;
