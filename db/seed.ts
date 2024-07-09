import { generateId } from "@/api/helpers/generate-id";
import { Todo, User, db } from "astro:db";
import { todoText } from "./seeds/todo-text";

// https://astro.build/db/seed
export default async function seed() {
  const { id: userId } = await db
    .insert(User)
    .values({
      id: generateId(),
      email: "rileypaul96@gmail.com",
      githubId: 71047303,
      githubUsername: "rjp301",
      name: "Riley Paul",
      avatarUrl: "https://avatars.githubusercontent.com/u/71047303?v=4",
    })
    .returning()
    .then((rows) => rows[0]);

  await db
    .insert(Todo)
    .values(todoText.map((text) => ({ id: generateId(), userId, text })));
}
