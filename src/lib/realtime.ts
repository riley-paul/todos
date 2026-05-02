import { z } from "astro/zod";
import {
  zListSelect,
  zListUserSelect,
  zTodoSelect,
  zUserSelect,
} from "./types";

import type { ActionAPIContext } from "astro:actions";
import { createDb } from "@/db";
import { Rest } from "ably";
import * as tables from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";

export const createChannelName = (info: {
  userId: string;
  sessionId: string;
}) => {
  return `user:${info.userId}:session:${info.sessionId}`;
};

const createAbly = (env: Env) => {
  return new Rest({ key: env.ABLY_API_KEY, clientId: "server" });
};

const createOperationSchema = <T extends z.ZodObject>(dataSchema: T) => {
  return z.discriminatedUnion("type", [
    z.object({
      type: z.literal("insert"),
      data: z.union([dataSchema, dataSchema.array()]),
    }),
    z.object({
      type: z.literal("update"),
      data: z.union([dataSchema, dataSchema.array()]),
    }),
    z.object({
      type: z.literal("delete"),
      id: z.union([z.string(), z.string().array()]),
    }),
  ]);
};

export const zPayload = z.discriminatedUnion("entity", [
  z.object({
    entity: z.literal("list"),
    operation: createOperationSchema(zListSelect),
  }),
  z.object({
    entity: z.literal("todo"),
    operation: createOperationSchema(zTodoSelect),
  }),
  z.object({
    entity: z.literal("listUser"),
    operation: createOperationSchema(zListUserSelect),
  }),
  z.object({
    entity: z.literal("user"),
    operation: createOperationSchema(zUserSelect),
  }),
]);
export type Payload = z.infer<typeof zPayload>;

export async function notifyOtherListUsers(
  c: ActionAPIContext,
  listId: string,
  payload: Payload,
) {
  const db = createDb(c.locals.env);
  const ably = createAbly(c.locals.env);

  const currentSessionId = c.locals.session?.id ?? "";

  const listUsers = await db
    .selectDistinct({
      userId: tables.ListUser.userId,
      sessionId: tables.UserSession.id,
    })
    .from(tables.ListUser)
    .innerJoin(
      tables.UserSession,
      eq(tables.ListUser.userId, tables.UserSession.userId),
    )
    .where(
      and(
        eq(tables.ListUser.listId, listId),
        ne(tables.UserSession.id, currentSessionId),
      ),
    );

  return Promise.all(
    listUsers.map((lu) => {
      const channelName = createChannelName(lu);
      const channel = ably.channels.get(channelName);
      return channel.publish("invalidate", payload);
    }),
  );
}
