import { defineAction } from "astro:actions";
import { z } from "zod";
import { isAuthorized } from "./helpers";
import db from "@/db";
import { Todo, User, UserSession } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getMe = defineAction({
  handler: async (_, c) => {
    const user = c.locals.user;
    if (!user) {
      return null;
    }
    const data = await db
      .select()
      .from(User)
      .where(eq(User.id, user.id))
      .then((rows) => rows[0]);
    return data;
  },
});

export const remove = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;
    await db.delete(UserSession).where(eq(UserSession.userId, userId));
    await db.delete(Todo).where(eq(Todo.userId, userId));
    await db.delete(User).where(eq(User.id, userId));
    return true;
  },
});

export const checkIfEmailExists = defineAction({
  input: z.object({
    email: z.string(),
  }),
  handler: async ({ email }) => {
    const data = await db.select().from(User).where(eq(User.email, email));
    return data.length > 0;
  },
});
