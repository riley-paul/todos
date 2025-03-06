import type { ListSelect } from "@/lib/types";
import React from "react";
import UserBubble from "./ui/user-bubble";
import { Text, Tooltip } from "@radix-ui/themes";
import DeleteButton from "./ui/delete-button";
import { useMutation } from "@tanstack/react-query";
import { actions } from "astro:actions";

type Props = { list: ListSelect };

const ListShares: React.FC<Props> = ({ list }) => {
  const deleteListShare = useMutation({
    mutationFn: actions.listShares.remove.orThrow,
  });

  return (
    <div className="min-h-12 overflow-y-auto rounded-3 border bg-panel-translucent px-2">
      <div className="grid divide-y">
        {list.shares.map((share) => (
          <div key={share.id} className="flex items-center gap-rx-3 py-2">
            <div className="relative">
              <UserBubble user={share.user} size="md" />
              {share.isPending && (
                <Tooltip side="left" content="Pending Invitation">
                  <div className="shadow absolute -right-0.5 -top-0.5 size-3 rounded-full bg-yellow-9" />
                </Tooltip>
              )}
            </div>
            <div className="grid flex-1 gap-0.5">
              <Text size="2" weight="medium">
                {share.user.name}
              </Text>
              <Text size="2" color="gray">
                {share.user.email}
              </Text>
            </div>

            {list.isAuthor && (
              <DeleteButton
                handleDelete={() => deleteListShare.mutate({ id: share.id })}
              />
            )}
          </div>
        ))}
        {list.shares.length === 0 && (
          <Text size="2" color="gray" align="center" className="p-6">
            No shares
          </Text>
        )}
      </div>
    </div>
  );
};

export default ListShares;
