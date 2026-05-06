import env from "@/envs-runtime";
import { createDb } from "..";
import { List, ListUser, Todo, User, UserSession } from "../schema";
import { and, eq } from "drizzle-orm";

const migrateTimestamps = async () => {
  const db = createDb(env);

  const todos = await db.select().from(Todo);
  for (const todo of todos) {
    await db
      .update(Todo)
      .set({
        updatedAt2: new Date(todo.updatedAt ?? new Date()),
        createdAt2: new Date(todo.createdAt ?? new Date()),
      })
      .where(eq(Todo.id, todo.id));
  }
  console.log("Migrated todos");

  const lists = await db.select().from(List);
  for (const list of lists) {
    await db
      .update(List)
      .set({
        updatedAt2: new Date(list.updatedAt ?? new Date()),
        createdAt2: new Date(list.createdAt ?? new Date()),
      })
      .where(eq(List.id, list.id));
  }
  console.log("Migrated lists");

  const users = await db.select().from(User);
  for (const user of users) {
    await db
      .update(User)
      .set({
        updatedAt2: new Date(user.updatedAt ?? new Date()),
        createdAt2: new Date(user.createdAt ?? new Date()),
      })
      .where(eq(User.id, user.id));
  }
  console.log("Migrated users");

  const listUsers = await db.select().from(ListUser);
  for (const listUser of listUsers) {
    await db
      .update(ListUser)
      .set({
        updatedAt2: new Date(listUser.updatedAt ?? new Date()),
        createdAt2: new Date(listUser.createdAt ?? new Date()),
      })
      .where(and(eq(ListUser.id, listUser.id)));
  }
  console.log("Migrated list users");

  const sessions = await db.select().from(UserSession);
  for (const session of sessions) {
    await db
      .update(UserSession)
      .set({
        updatedAt2: new Date(session.updatedAt ?? new Date()),
        createdAt2: new Date(session.createdAt ?? new Date()),
      })
      .where(eq(UserSession.id, session.id));
  }
  console.log("Migrated user sessions");

  console.log("Migration complete");
};

migrateTimestamps().catch(console.error);
