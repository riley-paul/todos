import { type ActionAPIContext, type ActionHandler } from "astro:actions";
import { createDb } from "@/db";
import { User, List, ListUser } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import {
  ensureListMember,
  invalidateListUsers,
  ensureAuthorized,
} from "../helpers";
import actionErrors from "../errors";
import * as listUserInputs from "./list-users.inputs";
import type { ListUserSelect } from "@/lib/types";

// export const create: ActionHandler<
//   typeof listUserInputs.create,
//   ListUserSelect
// > = async ({ email, listId }, c) => {
//   const db = createDb(c.locals.runtime.env);
//   const userId = ensureAuthorized(c).id;

//   // only list members can add other users
//   await ensureListMember(c, { listId, userId });

//   // check if user with email exists
//   const [user] = await db.select().from(User).where(eq(User.email, email));
//   if (!user) throw actionErrors.USER_NOT_FOUND;

//   // check if the user is already a member of the list
//   const [existingListUser] = await db
//     .select()
//     .from(ListUser)
//     .where(and(eq(ListUser.listId, listId), eq(ListUser.userId, user.id)));
//   if (existingListUser) throw actionErrors.DUPLICATE;

//   // insert the new list user
//   const [created] = await db
//     .insert(ListUser)
//     .values({ listId, userId: user.id })
//     .returning({ listUserId: ListUser.id });

//   await invalidateListUsers(c, listId);
//   return created;
// };

// export const remove: ActionHandler<typeof listUserInputs.remove, null> = async (
//   { id: listUserId },
//   c,
// ) => {
//   const db = createDb(c.locals.runtime.env);
//   const userId = ensureAuthorized(c).id;

//   // ensure current user is a member of the list or the one being removed
//   await ensureListMember(c, {
//     listId: data.listId,
//     userId,
//     checkPending: false,
//   });

//   await db
//     .delete(ListUser)
//     .where(
//       and(eq(ListUser.listId, data.listId), eq(ListUser.userId, data.userId)),
//     );

//   await invalidateListUsers(c, data.listId);
//   return null;
// };

export const populate: ActionHandler<
  typeof listUserInputs.populate,
  ListUserSelect[]
> = async (_, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = ensureAuthorized(c).id;

  const userLists = await db
    .select({ listId: ListUser.listId })
    .from(ListUser)
    .where(eq(ListUser.userId, userId))
    .then((rows) => rows.map(({ listId }) => listId));

  const listUsers: ListUserSelect[] = await db
    .select()
    .from(ListUser)
    .where(inArray(ListUser.listId, userLists));

  return listUsers;
};
