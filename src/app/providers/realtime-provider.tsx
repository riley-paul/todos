import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import * as Ably from "ably";
import React from "react";
import { useUser, useUserSession } from "./user-provider";
import * as collections from "@/app/lib/collections";
import { createChannelName, zPayload, type Payload } from "@/lib/realtime";

const realtimeClient = new Ably.Realtime({ authUrl: "/ably-auth" });

const handlePayload = (payload: Payload) => {
  switch (payload.entity) {
    case "list": {
      switch (payload.operation.type) {
        case "insert":
          collections.lists.utils.writeInsert(payload.operation.data);
          break;
        case "update":
          collections.lists.utils.refetch();
          break;
        case "delete":
          collections.lists.utils.writeDelete(payload.operation.id);
          break;
      }
      break;
    }

    case "todo": {
      switch (payload.operation.type) {
        case "insert":
          collections.todos.utils.writeInsert(payload.operation.data);
          break;
        case "update":
          collections.todos.utils.refetch();
          break;
        case "delete":
          collections.todos.utils.writeDelete(payload.operation.id);
          break;
      }
      break;
    }

    case "listUser": {
      switch (payload.operation.type) {
        case "insert":
          collections.listUsers.utils.writeInsert(payload.operation.data);
          break;
        case "update":
          collections.listUsers.utils.refetch();
          break;
        case "delete":
          collections.listUsers.utils.writeDelete(payload.operation.id);
          break;
      }
      break;
    }

    case "user": {
      switch (payload.operation.type) {
        case "insert":
          collections.users.utils.writeInsert(payload.operation.data);
          break;
        case "update":
          collections.users.utils.refetch();
          break;
        case "delete":
          collections.users.utils.writeDelete(payload.operation.id);
          break;
      }
      break;
    }
  }
};

type InvalidatorProps = React.PropsWithChildren<{ channelName: string }>;
const Invalidator: React.FC<InvalidatorProps> = ({ children, channelName }) => {
  useChannel(channelName, "invalidate", ({ data }) => {
    const { data: payload } = zPayload.safeParse(data);
    if (!payload) return;

    console.log("socket:", payload.entity, payload.operation.type);
    handlePayload(payload);
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
