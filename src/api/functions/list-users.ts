import { createDb } from "@/db";
import { User, List, ListUser } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ensureListMember, invalidateListUsers } from "../helpers";
import actionErrors from "../errors";
import * as listUserInputs from "../schema/list-users";
import type { ApiFunction, ListUserSelect } from "@/lib/types";
import { env } from "cloudflare:workers";

export const getListUser = async ({
  listUserId,
}: {
  listUserId: string;
}): Promise<ListUserSelect> => {
  const db = createDb(env);
  const [listUser] = await db
    .select({
      id: ListUser.id,
      userId: ListUser.userId,
      listId: ListUser.listId,
      isPending: ListUser.isPending,
      list: {
        id: List.id,
        name: List.name,
        isPending: ListUser.isPending,
      },
      user: {
        id: User.id,
        name: User.name,
        email: User.email,
        avatarUrl: User.avatarUrl,
      },
    })
    .from(ListUser)
    .innerJoin(List, eq(List.id, ListUser.listId))
    .innerJoin(User, eq(User.id, ListUser.userId))
    .where(eq(ListUser.id, listUserId));
  if (!listUser) throw actionErrors.NOT_FOUND;
  return listUser;
};

export const create: ApiFunction<
  typeof listUserInputs.create,
  ListUserSelect
> = async ({ email, listId, userId }) => {
  const db = createDb(env);

  // only list members can add other users
  await ensureListMember({ listId, userId });

  // check if user with email exists
  const [user] = await db.select().from(User).where(eq(User.email, email));
  if (!user) throw actionErrors.USER_NOT_FOUND;

  // check if the user is already a member of the list
  const [existingListUser] = await db
    .select()
    .from(ListUser)
    .where(and(eq(ListUser.listId, listId), eq(ListUser.userId, user.id)));
  if (existingListUser) throw actionErrors.DUPLICATE;

  // insert the new list user
  const [{ listUserId }] = await db
    .insert(ListUser)
    .values({ listId, userId: user.id })
    .returning({ listUserId: ListUser.id });

  await invalidateListUsers({ userId, listId });
  return getListUser({ listUserId });
};

export const remove: ApiFunction<typeof listUserInputs.remove, null> = async ({
  userId,
  listId,
}) => {
  const db = createDb(env);

  // ensure current user is a member of the list or the one being removed
  await ensureListMember({
    listId,
    userId,
    checkPending: false,
  });

  await db
    .delete(ListUser)
    .where(and(eq(ListUser.listId, listId), eq(ListUser.userId, userId)));

  await invalidateListUsers({ listId, userId });
  return null;
};

export const accept: ApiFunction<
  typeof listUserInputs.accept,
  ListUserSelect
> = async ({ listId, userId }) => {
  const db = createDb(env);

  // ensure list user exists and is pending and pertains to current user
  const [listUser] = await db
    .select()
    .from(ListUser)
    .where(
      and(
        eq(ListUser.listId, listId),
        eq(ListUser.userId, userId),
        eq(ListUser.isPending, true),
      ),
    );
  if (!listUser) throw actionErrors.NOT_FOUND;

  // update the list user to accept the invitation
  const [updated] = await db
    .update(ListUser)
    .set({ isPending: false })
    .where(
      and(
        eq(ListUser.listId, listId),
        eq(ListUser.userId, userId),
        eq(ListUser.isPending, true),
      ),
    )
    .returning();

  await invalidateListUsers({ userId, listId: updated.listId });
  return getListUser({ listUserId: updated.id });
};

export const getAllForList: ApiFunction<
  typeof listUserInputs.getAllForList,
  ListUserSelect[]
> = async ({ listId, userId }) => {
  const db = createDb(env);

  await ensureListMember({ listId, userId });

  return db
    .select({
      id: ListUser.id,
      userId: ListUser.userId,
      listId: ListUser.listId,
      isPending: ListUser.isPending,
      list: {
        id: List.id,
        name: List.name,
        isPending: ListUser.isPending,
      },
      user: {
        id: User.id,
        name: User.name,
        email: User.email,
        avatarUrl: User.avatarUrl,
      },
    })
    .from(ListUser)
    .innerJoin(List, eq(List.id, ListUser.listId))
    .innerJoin(User, eq(User.id, ListUser.userId))
    .where(eq(ListUser.listId, listId));
};
