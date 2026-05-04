import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import * as Ably from "ably";
import React from "react";
import { useUser, useUserSession } from "./user-provider";
import { createChannelName } from "@/lib/realtime";
import { useQueryClient } from "@tanstack/react-query";

const realtimeClient = new Ably.Realtime({ authUrl: "/ably-auth" });

type InvalidatorProps = React.PropsWithChildren<{ channelName: string }>;
const Invalidator: React.FC<InvalidatorProps> = ({ children, channelName }) => {
  const queryClient = useQueryClient();

  useChannel(channelName, "invalidate", ({ data }) => {
    console.log("Received invalidate message", { channelName, data });
    queryClient.invalidateQueries();
  });

  return children;
};

type RealtimeProviderProps = React.PropsWithChildren;
const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  const currentUser = useUser();
  const currentUserSession = useUserSession();

  const channelName = createChannelName({
    userId: currentUser.id,
    sessionId: currentUserSession.id,
  });

  return (
    <AblyProvider client={realtimeClient}>
      <ChannelProvider channelName={channelName}>
        <Invalidator channelName={channelName}>{children}</Invalidator>
      </ChannelProvider>
    </AblyProvider>
  );
};

export default RealtimeProvider;
