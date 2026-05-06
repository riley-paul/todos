import env from "@/envs-runtime";
import { createDb } from "..";
import { List, ListUser, Todo, User, UserSession } from "../schema";
import { and, eq } from "drizzle-orm";

const migrateBackfillUpdatedAt = async () => {
  const db = createDb(env);

  const todos = await db.select().from(Todo);
  for (const todo of todos) {
    if (todo.updatedAt) continue;
    await db
      .update(Todo)
      .set({ updatedAt: todo.createdAt })
      .where(eq(Todo.id, todo.id));
  }
  console.log("Migrated todos");

  const lists = await db.select().from(List);
  for (const list of lists) {
    if (list.updatedAt) continue;
    await db
      .update(List)
      .set({ updatedAt: list.createdAt })
      .where(eq(List.id, list.id));
  }
  console.log("Migrated lists");

  const users = await db.select().from(User);
  for (const user of users) {
    if (user.updatedAt) continue;
    await db
      .update(User)
      .set({ updatedAt: user.createdAt })
      .where(eq(User.id, user.id));
  }
  console.log("Migrated users");

  const listUsers = await db.select().from(ListUser);
  for (const listUser of listUsers) {
    if (listUser.updatedAt) continue;
    await db
      .update(ListUser)
      .set({ updatedAt: listUser.createdAt })
      .where(and(eq(ListUser.id, listUser.id)));
  }
  console.log("Migrated list users");

  const sessions = await db.select().from(UserSession);
  for (const session of sessions) {
    if (session.updatedAt) continue;
    await db
      .update(UserSession)
      .set({ updatedAt: session.createdAt })
      .where(eq(UserSession.id, session.id));
  }
  console.log("Migrated user sessions");

  console.log("Migration complete");
};

migrateBackfillUpdatedAt().catch(console.error);
