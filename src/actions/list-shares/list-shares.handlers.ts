import { type ActionHandler } from "astro:actions";
import { createDb } from "@/db";
import { User, ListShare, List } from "@/db/schema";
import { eq, and, or, desc } from "drizzle-orm";
import type { ListShareSelect, ListShareSelectShallow } from "@/lib/types";
import { isAuthorized } from "../helpers";
import actionErrors from "../errors";
import type listShareInputs from "./list-shares.inputs";

const create: ActionHandler<
  typeof listShareInputs.create,
  ListShareSelectShallow
> = async ({ email, listId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [sharedUser] = await db
    .select()
    .from(User)
    .where(eq(User.email, email));

  if (!sharedUser) {
    throw actionErrors.EMAIL_NOT_FOUND;
  }

  if (sharedUser.id === userId) {
    throw actionErrors.SHARE_WITH_SELF;
  }

  const [list] = await db.select().from(List).where(eq(List.id, listId));

  if (!list) {
    throw actionErrors.NOT_FOUND;
  }

  if (list.userId !== userId) {
    throw actionErrors.NO_PERMISSION;
  }

  const existingShares = await db
    .select()
    .from(ListShare)
    .where(
      and(
        eq(ListShare.listId, listId),
        eq(ListShare.sharedUserId, sharedUser.id),
      ),
    );

  if (existingShares.length > 0) {
    // user already has access to this list
    throw actionErrors.DUPLICATE;
  }

  const [listShare] = await db
    .insert(ListShare)
    .values({
      listId,
      userId,
      sharedUserId: sharedUser.id,
    })
    .returning({ id: ListShare.id, isPending: ListShare.isPending });

  return listShare;
};

const remove: ActionHandler<typeof listShareInputs.remove, null> = async (
  { id },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const [share] = await db.select().from(ListShare).where(eq(ListShare.id, id));

  if (share.sharedUserId !== userId && share.userId !== userId) {
    throw actionErrors.NO_PERMISSION;
  }

  await db
    .delete(ListShare)
    .where(
      and(
        eq(ListShare.id, id),
        or(eq(ListShare.userId, userId), eq(ListShare.sharedUserId, userId)),
      ),
    );

  return null;
};

const leave: ActionHandler<typeof listShareInputs.leave, null> = async (
  { listId },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  await db
    .delete(ListShare)
    .where(
      and(eq(ListShare.listId, listId), eq(ListShare.sharedUserId, userId)),
    );

  return null;
};

const accept: ActionHandler<
  typeof listShareInputs.accept,
  ListShareSelectShallow
> = async ({ id }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [listShare] = await db
    .select({
      id: ListShare.id,
      isPending: ListShare.isPending,
      sharedUserId: ListShare.sharedUserId,
    })
    .from(ListShare)
    .where(eq(ListShare.id, id));

  if (!listShare) {
    throw actionErrors.NOT_FOUND;
  }

  if (listShare.sharedUserId !== userId) {
    throw actionErrors.NO_PERMISSION;
  }

  await db
    .update(ListShare)
    .set({ isPending: false })
    .where(and(eq(ListShare.id, id), eq(ListShare.sharedUserId, userId)));

  return listShare;
};

const getAllPending: ActionHandler<
  typeof listShareInputs.getAllPending,
  ListShareSelect[]
> = async (_, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  const listShares = await db
    .selectDistinct({
      id: ListShare.id,
      list: {
        id: List.id,
        name: List.name,
      },
      isPending: ListShare.isPending,
      user: {
        id: User.id,
        name: User.name,
        email: User.email,
        avatarUrl: User.avatarUrl,
      },
      createdAt: ListShare.createdAt,
    })
    .from(ListShare)
    .innerJoin(User, eq(User.id, ListShare.userId))
    .innerJoin(List, eq(List.id, ListShare.listId))
    .where(
      and(eq(ListShare.sharedUserId, userId), eq(ListShare.isPending, true)),
    )
    .orderBy(desc(ListShare.createdAt));
  return listShares;
};

const listShareHandlers = { create, remove, leave, accept, getAllPending };
export default listShareHandlers;
