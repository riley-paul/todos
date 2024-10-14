import { count, db, eq, Todo } from "astro:db";

export default async function deleteIsDeletedTodos() {
  const numDeletedTodos = await db
    .select({ count: count() })
    .from(Todo)
    .where(eq(Todo.isDeleted, true))
    .then((rows) => rows[0].count);
  console.log(`Deleting ${numDeletedTodos} todos...`);

  await db.delete(Todo).where(eq(Todo.isDeleted, true));
}
