import { db } from ".";
import { todosTable, listsTable, userTable, sessionTable } from "./schema";

async function seed() {
  await db.delete(sessionTable);
  await db.delete(userTable);
  await db.delete(listsTable);
  await db.delete(todosTable);

  console.log("\n\nData cleared\n\n");

  const { id: userId } = await db
    .insert(userTable)
    .values({
      githubId: 71047303,
      username: "rjp301",
      name: "Riley Paul",
      avatarUrl: "https://avatars.githubusercontent.com/u/71047303?v=4",
    })
    .returning()
    .then((rows) => rows[0]);

  const lists = await db
    .insert(listsTable)
    .values([
      { userId, name: "Groceries" },
      { userId, name: "Personal" },
      { userId, name: "Work" },
    ])
    .returning();

  await db.insert(todosTable).values([
    {
      userId,
      text: "Buy milk",
      listId: lists[0].id,
    },
    {
      userId,
      text: "Buy eggs",
      listId: lists[0].id,
    },
    {
      userId,
      text: "Buy bread",
      listId: lists[0].id,
    },
    {
      userId,
      text: "Learn TypeScript",
      isCompleted: true,
      listId: lists[1].id,
    },
    {
      userId,
      text: "Learn React",
      isCompleted: true,
      listId: lists[1].id,
    },
    {
      userId,
      text: "Learn Hono",
      listId: lists[1].id,
    },
    {
      userId,
      text: "Finish the project",
      listId: lists[2].id,
    },
  ]);

  console.log("Seeded todos");
}

seed();
