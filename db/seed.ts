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
    { id: generateId(), text: "Learn Astro", userId },
    { id: generateId(), text: "Build a website", userId },
    { id: generateId(), text: "Profit", userId },
  ]);
}
