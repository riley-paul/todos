import env from "@/envs-runtime";
import { createDb } from "..";
import { List, ListUser, Todo, User } from "../schema";
import { and, eq, isNull } from "drizzle-orm";

const migrateInboxTodos = async () => {
  const db = createDb(env);

  const users = await db.select().from(User);

  for (const user of users) {
    console.log("User:", user.name, user.email);

    const inboxTodos = await db
      .select()
      .from(Todo)
      .where(and(isNull(Todo.listId), eq(Todo.userId, user.id)));

    const [inboxList] = await db
      .insert(List)
      .values({ name: "Inbox" })
      .returning();

    await db
      .insert(ListUser)
      .values({
        userId: user.id,
        listId: inboxList.id,
        isPending: false,
      })
      .returning();

    await Promise.all(
      inboxTodos.map((todo) =>
        db
          .update(Todo)
          .set({ listId: inboxList.id })
          .where(eq(Todo.id, todo.id)),
      ),
    );

    console.log("Migrated", inboxTodos.length, "todos");
  }
  
  console.log("Migration complete")
};

migrateInboxTodos().catch(console.error);
