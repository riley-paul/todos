import { builder } from "../gql-builder";
import { createDb } from "@/db";
import * as tables from "@/db/schema";
import { notifyOtherListUsers } from "@/lib/realtime";
import { and, eq } from "drizzle-orm";

builder.mutationFields((t) => ({
  acceptListInvite: t.drizzleField({
    type: "List",
    args: { listId: t.arg.id() },
    nullable: true,
    resolve: async (query, _root, { listId }, ctx) => {
      const db = createDb(ctx.env);
      const [updated] = await db
        .update(tables.ListUser)
        .set({ isPending: false, show: true })
        .where(
          and(
            eq(tables.ListUser.listId, listId),
            eq(tables.ListUser.userId, ctx.userId),
          ),
        )
        .returning();

      await notifyOtherListUsers(ctx, listId);
      return db.query.List.findFirst(
        query({ where: { id: { eq: updated.listId } } }),
      );
    },
  }),

  leaveList: t.boolean({
    args: { listId: t.arg.id() },
    resolve: async (_root, { listId }, ctx) => {
      const db = createDb(ctx.env);
      await db
        .delete(tables.ListUser)
        .where(
          and(
            eq(tables.ListUser.listId, listId),
            eq(tables.ListUser.userId, ctx.userId),
          ),
        );
      await notifyOtherListUsers(ctx, listId);
      return true;
    },
  }),

  inviteUserToList: t.drizzleField({
    type: "List",
    args: { listId: t.arg.id(), email: t.arg.string() },
    nullable: true,
    resolve: async (query, _root, { listId, email }, ctx) => {
      const db = createDb(ctx.env);
      const isMember = await db.query.ListUser.findFirst({
        where: { listId, userId: ctx.userId, isPending: false },
      });

      if (!isMember) throw new Error("You are not a member of the list");

      const user = await db.query.User.findFirst({ where: { email } });

      if (!user) throw new Error("User not found");

      const existingInvite = await db.query.ListUser.findFirst({
        where: { listId, userId: user.id },
      });

      if (existingInvite)
        throw new Error("User is already invited or a member of the list");

      const [newInvite] = await db
        .insert(tables.ListUser)
        .values({ listId, userId: user.id, isPending: true })
        .returning();

      await notifyOtherListUsers(ctx, listId);
      return db.query.List.findFirst(
        query({ where: { id: { eq: newInvite.listId } } }),
      );
    },
  }),

  removeUserFromList: t.drizzleField({
    type: "List",
    args: { listUserId: t.arg.id() },
    nullable: true,
    resolve: async (query, _root, { listUserId }, ctx) => {
      const db = createDb(ctx.env);
      const membership = await db.query.ListUser.findFirst({
        where: { id: listUserId },
      });

      if (!membership) throw new Error("Membership not found");

      const isMember = await db.query.ListUser.findFirst({
        where: {
          listId: membership.listId,
          userId: ctx.userId,
          isPending: false,
        },
      });

      if (!isMember) throw new Error("You are not a member of the list");

      await db
        .delete(tables.ListUser)
        .where(eq(tables.ListUser.id, listUserId));

      await notifyOtherListUsers(ctx, membership.listId);
      return db.query.List.findFirst(
        query({ where: { id: { eq: membership.listId } } }),
      );
    },
  }),
}));
