import { Bell, CircleCheckBig } from "lucide-react";
import React from "react";
import { cn } from "../lib/utils";
import UserAvatar from "./user-avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { pendingSharesQueryOptions } from "@/lib/queries";
import UserBubble from "./base/user-bubble";
import useMutations from "@/hooks/use-mutations";

const Header: React.FC = () => {
  const pendingSharesQuery = useQuery(pendingSharesQueryOptions);
  const numPendingShares = pendingSharesQuery.data?.length ?? 0;
  const { acceptListShare, deleteListShare } = useMutations();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 shrink-0 border-b bg-background/30 backdrop-blur",
      )}
    >
      <div className="container2 flex h-full items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <CircleCheckBig size="1.5rem" className="text-primary" />
          <div className="text-2xl font-bold">Todos</div>
        </div>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="relative rounded-full"
              >
                <Bell className="size-4" />
                {numPendingShares > 0 && (
                  <div className="absolute -right-3 -top-1 rounded-full bg-primary px-2 py-0.5 text-xs">
                    {numPendingShares}
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="py-2">
              <div className="grid divide-y">
                {pendingSharesQuery.data?.map((share) => (
                  <div className="flex items-center gap-3 py-2">
                    <div className="h-full">
                      <UserBubble user={share.invitedBy} />
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
                          onClick={() =>
                            acceptListShare.mutate({ id: share.id })
                          }
                        >
                          <span>Accept</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            deleteListShare.mutate({ id: share.id })
                          }
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
            </PopoverContent>
          </Popover>
          <UserAvatar />
        </div>
      </div>
    </header>
  );
};

export default Header;
