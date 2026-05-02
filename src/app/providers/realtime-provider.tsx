import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import * as Ably from "ably";
import React from "react";
import { useUser } from "./user-provider";
import * as collections from "@/app/lib/collections";
import { zPayload, type Payload } from "@/lib/realtime";

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

const Invalidator: React.FC<React.PropsWithChildren> = ({ children }) => {
  const currentUser = useUser();
  useChannel(`user:${currentUser.id}`, "invalidate", ({ data }) => {
    const { data: payload } = zPayload.safeParse(data);
    if (!payload) return;

    console.log("socket:", payload.entity, payload.operation.type);
    handlePayload(payload);
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
