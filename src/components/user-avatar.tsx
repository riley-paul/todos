import React from "react";

import LoginButton from "./login-button";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/queries";
import useMutations from "@/hooks/use-mutations";
import { AlertDialog, Avatar, Button, Popover, Text } from "@radix-ui/themes";
import { LogOut, Trash } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AccountDeletionConfirm: React.FC<DialogProps> = (props) => {
  const { isOpen, setIsOpen } = props;
  const { deleteUser } = useMutations();
  return (
    <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete Account</AlertDialog.Title>
        <AlertDialog.Description>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </AlertDialog.Description>
        <div className="mt-rx-3 flex justify-end gap-rx-3">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action type="submit">
            <Button
              variant="solid"
              color="red"
              onClick={() => deleteUser.mutate({})}
            >
              Continue
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

const UserAvatar: React.FC = () => {
  const [accountDeletionOpen, setAccountDeletionOpen] = React.useState(false);

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
      <AccountDeletionConfirm
        isOpen={accountDeletionOpen}
        setIsOpen={setAccountDeletionOpen}
      />
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
                onClick={() => setAccountDeletionOpen(true)}
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
