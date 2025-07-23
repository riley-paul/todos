import React from "react";
import { useQuery } from "@tanstack/react-query";
import { qPendingShares } from "@/lib/client/queries";
import {
  Badge,
  Button,
  IconButton,
  Popover,
  Strong,
  Text,
} from "@radix-ui/themes";
import { BellIcon, CheckIcon, XIcon } from "lucide-react";
import useMutations from "@/hooks/use-mutations";

const PendingInvites: React.FC = () => {
  const pendingSharesQuery = useQuery(qPendingShares);
  const numPendingShares = pendingSharesQuery.data?.length ?? 0;

  const { leaveList, acceptListJoin } = useMutations();

  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton variant="soft" className="relative rounded-full">
          <BellIcon className="size-4" />
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
      <Popover.Content
        align="end"
        className="max-h-[80vh] max-w-72 overflow-auto py-2"
      >
        <div className="grid divide-y px-rx-2">
          {pendingSharesQuery.data?.map((share) => (
            <div
              key={share.id}
              className="flex w-full items-center gap-rx-3 py-rx-4"
            >
              <div className="grid flex-1 gap-3">
                <Text size="2">
                  You have been invited you to join {" "}
                  <Strong>{share.list.name}</Strong>
                </Text>
                <div className="grid grid-cols-2 gap-rx-2">
                  <Button
                    size="1"
                    variant="soft"
                    onClick={() => acceptListJoin.mutate({ id: share.id })}
                  >
                    <CheckIcon className="size-3" />
                    <span>Accept</span>
                  </Button>
                  <Button
                    size="1"
                    variant="soft"
                    color="red"
                    onClick={() => leaveList.mutate({ listId: share.list.id })}
                  >
                    <XIcon className="size-3" />
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
