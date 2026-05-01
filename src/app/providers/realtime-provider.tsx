import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import * as Ably from "ably";
import React from "react";
import { useUser } from "./user-provider";

const realtimeClient = new Ably.Realtime({ authUrl: "/ably-auth" });

const Invalidator: React.FC<React.PropsWithChildren> = ({ children }) => {
  // const queryClient = useQueryClient();
  const currentUser = useUser();
  useChannel(`user:${currentUser.id}`, "invalidate", () => {
    console.log("Invalidating...");
    // queryClient.invalidateQueries();
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
