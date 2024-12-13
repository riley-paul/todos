import React from "react";

import LoginButton from "./login-button";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/queries";
import { cn } from "@/lib/utils";
import useMutations from "@/hooks/use-mutations";
import {
  AlertDialog,
  Avatar,
  Button,
  Flex,
  Grid,
  Popover,
  Text,
} from "@radix-ui/themes";
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
        <Flex gap="3" mt="4" justify="end">
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
        </Flex>
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
            size="2"
            radius="full"
            src={user.avatarUrl ?? ""}
            fallback={user.name[0].toUpperCase()}
          />
        </Popover.Trigger>
        <Popover.Content align="end">
          <Grid gap="4">
            <Flex gap="4" align="center">
              <Avatar
                size="5"
                radius="full"
                src={user.avatarUrl ?? ""}
                fallback={user.name[0].toUpperCase()}
              />
              <Grid className="flex flex-col justify-center">
                <Text weight="medium" size="4">
                  {user.name}
                </Text>
                <Text size="2" color="gray">
                  {user.email}
                </Text>
              </Grid>
            </Flex>

            <Grid columns="2" gap="2">
              <Button asChild className={cn("relative")}>
                <a href="/logout">
                  <LogOut size="1rem" />
                  <span>Logout</span>
                </a>
              </Button>
              <Button
                color="red"
                size="2"
                onClick={() => setAccountDeletionOpen(true)}
              >
                <Trash size="1rem" />
                <span>Delete Account</span>
              </Button>
            </Grid>
          </Grid>
        </Popover.Content>
      </Popover.Root>
    </>
  );
};

export default UserAvatar;
