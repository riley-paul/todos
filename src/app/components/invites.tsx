import type { ListUserSelect } from "@/lib/types";
import {
  Badge,
  Button,
  Dialog,
  IconButton,
  Skeleton,
  Strong,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { MailIcon, MailXIcon } from "lucide-react";
import React from "react";
import Empty from "./ui/empty";
import ResponsiveDialogContent from "./ui/responsive-dialog-content";
import useMutations from "../hooks/use-mutations";

const Invite: React.FC<{ invite: ListUserSelect }> = ({ invite }) => {
  const { leaveList, acceptListJoin } = useMutations();

  const handleDecline = () => {
    leaveList.mutate({ listId: invite.listId });
  };

  const handleAccept = () => {
    acceptListJoin.mutate({ listId: invite.listId });
  };

  return (
    <div className="hover:bg-accent-3 rounded-4 -mx-3 grid gap-2 px-3 py-2">
      <Text size="2">
        <Strong>{invite.user.name}</Strong> invited you to join{" "}
        <Strong>{invite.list.name}</Strong>
      </Text>
      <footer className="flex gap-3">
        <Button size="1" variant="ghost" radius="full" onClick={handleAccept}>
          Accept
        </Button>
        <Button
          size="1"
          variant="ghost"
          radius="full"
          color="gray"
          onClick={handleDecline}
        >
          Decline
        </Button>
      </footer>
    </div>
  );
};

const InviteList: React.FC<{ invites: ListInviteSelect[] }> = ({ invites }) => {
  if (invites.length === 0)
    return (
      <Empty.Root>
        <Empty.Header>
          <Empty.Media variant="icon">
            <MailXIcon />
          </Empty.Media>
          <Empty.Title>No Invitations</Empty.Title>
          <Empty.Description>
            You have no pending invitations at this time.
          </Empty.Description>
        </Empty.Header>
      </Empty.Root>
    );

  return (
    <article className="-mx-6 flex h-full flex-col gap-1 overflow-x-hidden overflow-y-auto px-6">
      {invites.map((invite) => (
        <Invite key={invite.id} invite={invite} />
      ))}
    </article>
  );
};

const Invites: React.FC = () => {
  
  
  if (isLoading) {
    return (
      <Skeleton className="rounded-full">
        <IconButton radius="full" />
      </Skeleton>
    );
  }

  return (
    <Dialog.Root>
      <Tooltip side="bottom" content="Invitations">
        <Dialog.Trigger>
          <IconButton radius="full" variant="soft" className="relative">
            <MailIcon className="size-4" />
            {invites.length > 0 && (
              <Badge
                size="1"
                radius="full"
                variant="solid"
                color="red"
                className="absolute -top-2 -right-2"
              >
                {invites.length}
              </Badge>
            )}
          </IconButton>
        </Dialog.Trigger>
      </Tooltip>
      <ResponsiveDialogContent>
        <header>
          <Dialog.Title>Invites</Dialog.Title>
          <Dialog.Description size="2" color="gray">
            Manage your list invitations here.
          </Dialog.Description>
        </header>
        <InviteList invites={invites} />
        <footer className="flex justify-end">
          <Dialog.Close>
            <Button size="3" variant="soft" className="flex-1 sm:flex-0">
              Done
            </Button>
          </Dialog.Close>
        </footer>
      </ResponsiveDialogContent>
    </Dialog.Root>
  );
};

export default Invites;
