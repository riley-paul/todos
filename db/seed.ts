import { generateId } from "@/api/helpers/generate-id";
import { Todo, User, db } from "astro:db";

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

  await db.insert(Todo).values([
    {
      id: generateId(),
      userId,
      text: "#fun Finish the Astro tutorial",
    },
    {
      id: generateId(),
      userId,
      text: "#work Update hours on JIRA",
    },
    {
      id: generateId(),
      userId,
      text: "#chores Do the dishes",
    },
    {
      id: generateId(),
      userId,
      text: "Go for a run",
    },
    {
      id: generateId(),
      userId,
      text: "#shopping Milk",
    },
    {
      id: generateId(),
      userId,
      text: "#shopping Eggs",
    },
    {
      id: generateId(),
      userId,
      text: "#shopping Sugar",
    },
    {
      id: generateId(),
      userId,
      text: "#shopping Cereal",
    },
  ]);
}
