import React from "react";

import LoginButton from "./login-button";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/queries";
import { Avatar, Button, Popover, Text } from "@radix-ui/themes";
import { LogOut, Trash } from "lucide-react";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import useMutations from "@/hooks/use-mutations";

const UserAvatar: React.FC = () => {
  const { deleteUser } = useMutations();

  const [DeletionDialog, confirmDeletion] = useConfirmDialog({
    title: "Delete Account",
    description:
      "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  });

  const userQuery = useQuery(userQueryOptions);

  if (userQuery.isLoading) {
    return null;
  }

  if (userQuery.isError) {
    return <div>Error loading user</div>;
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
    <>
      <DeletionDialog />
      <Popover.Root>
        <Popover.Trigger title="User settings">
          <Avatar
            size="3"
            radius="full"
            src={user.avatarUrl ?? ""}
            fallback={user.name[0].toUpperCase()}
            className="cursor-pointer"
          />
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

            <div className="grid gap-rx-2">
              <Button asChild className="relative" variant="surface">
                <a href="/logout">
                  <LogOut className="absolute left-rx-2 size-4" />
                  <span>Logout</span>
                </a>
              </Button>
              <Button
                color="red"
                variant="surface"
                size="2"
                onClick={async () => {
                  const ok = await confirmDeletion();
                  if (ok) {
                    deleteUser.mutate({});
                  }
                }}
                className="relative"
              >
                <Trash className="absolute left-rx-2 size-4" />
                <span>Delete Account</span>
              </Button>
            </div>
          </div>
        </Popover.Content>
      </Popover.Root>
    </>
  );
};

export default UserAvatar;
