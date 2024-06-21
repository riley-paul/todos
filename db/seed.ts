import { generateId } from "@/api/helpers/generate-id";
import { Todo, User, List, db } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  const { id: userId } = await db
    .insert(User)
    .values({
      id: generateId(),
      githubId: 71047303,
      username: "rjp301",
      name: "Riley Paul",
      avatarUrl: "https://avatars.githubusercontent.com/u/71047303?v=4",
    })
    .returning()
    .then((rows) => rows[0]);

  const lists = await db
    .insert(List)
    .values([
      { id: generateId(), name: "Work", userId },
      { id: generateId(), name: "Personal", userId },
      { id: generateId(), name: "Shopping", userId },
    ])
    .returning();

  await db.insert(Todo).values([
    {
      id: generateId(),
      userId,
      text: "Finish the Astro tutorial",
      listId: lists[0].id,
    },
    {
      id: generateId(),
      userId,
      text: "Update hours on JIRA",
      listId: lists[0].id,
    },
    {
      id: generateId(),
      userId,
      text: "Do the dishes",
      listId: lists[1].id,
    },
    {
      id: generateId(),
      userId,
      text: "Go for a run",
      listId: lists[1].id,
    },
    {
      id: generateId(),
      userId,
      text: "Milk",
      listId: lists[2].id,
    },
    {
      id: generateId(),
      userId,
      text: "Eggs",
      listId: lists[2].id,
    },
    {
      id: generateId(),
      userId,
      text: "Sugar",
      listId: lists[2].id,
    },
    {
      id: generateId(),
      userId,
      text: "Cereal",
      listId: lists[2].id,
    },
  ]);
}
