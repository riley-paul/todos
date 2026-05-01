import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import * as Ably from "ably";
import React from "react";
import { useUser } from "./user-provider";
import * as collections from "@/app/lib/collections";
import { zEntityType } from "@/lib/types";

const realtimeClient = new Ably.Realtime({ authUrl: "/ably-auth" });

const Invalidator: React.FC<React.PropsWithChildren> = ({ children }) => {
  const currentUser = useUser();
  useChannel(`user:${currentUser.id}`, "invalidate", ({ data }) => {
    const { data: entityType } = zEntityType.safeParse(data.entityType);
    if (!entityType) return;

    console.log("Invalidating...", entityType);

    switch (entityType) {
      case "list":
        collections.lists.utils.refetch();
        break;
      case "listUser":
        collections.listUsers.utils.refetch();
        break;
      case "todo":
        collections.todos.utils.refetch();
        break;
      case "user":
        collections.users.utils.refetch();
        break;
    }
  });

  return children;
};

const RealtimeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const currentUser = useUser();
  return (
    <AblyProvider client={realtimeClient}>
      <ChannelProvider channelName={`user:${currentUser.id}`}>
        <Invalidator>{children}</Invalidator>
      </ChannelProvider>
    </AblyProvider>
  );
};

export default RealtimeProvider;
