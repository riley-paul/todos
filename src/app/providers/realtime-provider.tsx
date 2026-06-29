import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import * as Ably from "ably";
import React from "react";
import { useUser, useUserSession } from "./user-provider";
import { createChannelName } from "@/lib/realtime";
import { z } from "astro/zod";
import { useLazyQuery } from "@apollo/client/react";
import { GetListDocument } from "../gql.gen";

const realtimeClient = new Ably.Realtime({ authUrl: "/ably-auth" });
const zData = z.array(z.string());

type InvalidatorProps = React.PropsWithChildren<{ channelName: string }>;
const Invalidator: React.FC<InvalidatorProps> = ({ children, channelName }) => {
  const [getList] = useLazyQuery(GetListDocument, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
  });

  useChannel(channelName, "invalidate", ({ data }) => {
    console.log("Received invalidate message", { channelName, data });
    const { data: listIds = [] } = zData.safeParse(data);
    listIds.forEach((listId) => {
      getList({ variables: { listId } });
    });
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
