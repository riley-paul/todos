import React from "react";
import { useQuery } from "@tanstack/react-query";
import { pendingSharesQueryOptions } from "@/lib/queries";
import UserBubble from "./base/user-bubble";
import useMutations from "@/hooks/use-mutations";
import { Button, IconButton, Popover } from "@radix-ui/themes";

const PendingInvites: React.FC = () => {
  const pendingSharesQuery = useQuery(pendingSharesQueryOptions);
  const numPendingShares = pendingSharesQuery.data?.length ?? 0;
  const { acceptListShare, deleteListShare } = useMutations();

  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton
          variant="soft"
          className="relative rounded-full"
        >
          <i className="fa-solid fa-bell" />
          {numPendingShares > 0 && (
            <div className="absolute -right-3 -top-1 rounded-full bg-primary px-2 py-0.5 text-xs">
              {numPendingShares}
            </div>
          )}
        </IconButton>
      </Popover.Trigger>
      <Popover.Content align="end" className="py-2">
        <div className="grid divide-y">
          {pendingSharesQuery.data?.map((share) => (
            <div key={share.id} className="flex items-center gap-3 py-2">
              <div className="h-full">
                <UserBubble user={share.invitedBy} size="md" />
              </div>
              <div className="grid gap-2">
                <span className="text-sm">
                  <b>{share.invitedBy.name}</b> invited you to join{" "}
                  <b>{share.list.name}</b>
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => acceptListShare.mutate({ id: share.id })}
                  >
                    <span>Accept</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteListShare.mutate({ id: share.id })}
                  >
                    <span>Decline</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {pendingSharesQuery.data?.length === 0 && (
            <div className="flex min-h-12 items-center justify-center text-sm text-muted-foreground">
              No pending shares
            </div>
          )}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default PendingInvites;
