import React from "react";
import { useQuery } from "@tanstack/react-query";
import { pendingSharesQueryOptions } from "@/lib/queries";
import UserBubble from "./ui/user-bubble";
import useMutations from "@/hooks/use-mutations";
import {
  Badge,
  Button,
  IconButton,
  Popover,
  Strong,
  Text,
} from "@radix-ui/themes";

const PendingInvites: React.FC = () => {
  const pendingSharesQuery = useQuery(pendingSharesQueryOptions);
  const numPendingShares = pendingSharesQuery.data?.length ?? 0;
  const { acceptListShare, deleteListShare } = useMutations();

  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton variant="soft" className="relative rounded-full">
          <i className="fa-solid fa-bell" />
          {numPendingShares > 0 && (
            <Badge
              variant="solid"
              color="gray"
              className="absolute -right-2 -top-2 rounded-full py-0.5"
            >
              <Text size="1">{numPendingShares}</Text>
            </Badge>
          )}
        </IconButton>
      </Popover.Trigger>
      <Popover.Content align="end" className="max-w-72 py-2 max-h-[80vh] overflow-auto">
        <div className="grid divide-y px-rx-2">
          {pendingSharesQuery.data?.map((share) => (
            <div
              key={share.id}
              className="flex w-full items-center gap-rx-3 py-rx-4"
            >
              <div className="h-full">
                <UserBubble user={share.invitedBy} size="md" />
              </div>
              <div className="grid flex-1 gap-3">
                <Text size="2">
                  <Strong>{share.invitedBy.name}</Strong> invited you to join{" "}
                  <Strong>{share.list.name}</Strong>
                </Text>
                <div className="grid grid-cols-2 gap-rx-2">
                  <Button
                    size="1"
                    variant="soft"
                    onClick={() => acceptListShare.mutate({ id: share.id })}
                  >
                    <i className="fa-solid fa-check" />
                    <span>Accept</span>
                  </Button>
                  <Button
                    size="1"
                    variant="soft"
                    color="red"
                    onClick={() => deleteListShare.mutate({ id: share.id })}
                  >
                    <i className="fa-solid fa-xmark" />
                    <span>Decline</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {pendingSharesQuery.data?.length === 0 && (
            <Text className="p-4" size="2" color="gray" align="center">
              No pending invites
            </Text>
          )}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default PendingInvites;
