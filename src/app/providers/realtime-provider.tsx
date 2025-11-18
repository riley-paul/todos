import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import * as Ably from "ably";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { UserSelect } from "@/lib/types";

const realtimeClient = new Ably.Realtime({ authUrl: "/ably-auth" });

type Props = React.PropsWithChildren<{ currentUser: UserSelect }>;

const Invalidator: React.FC<Props> = ({ children, currentUser }) => {
  const queryClient = useQueryClient();
  useChannel(`user:${currentUser.id}`, "invalidate", () => {
    console.log("Invalidating...");
    queryClient.invalidateQueries();
  });

  return children;
};

const RealtimeProvider: React.FC<Props> = ({ children, currentUser }) => {
  return (
    <AblyProvider client={realtimeClient}>
      <ChannelProvider channelName={`user:${currentUser.id}`}>
        <Invalidator currentUser={currentUser}>{children}</Invalidator>
      </ChannelProvider>
    </AblyProvider>
  );
};

export default RealtimeProvider;
