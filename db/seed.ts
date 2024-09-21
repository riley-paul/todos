import { SharedTag, Todo, User, db } from "astro:db";
import { todoText } from "./seeds/todo-text";

import { v4 as uuid } from "uuid";

// https://astro.build/db/seed
export default async function seed() {
  const userIds = await db
    .insert(User)
    .values([
      {
        id: uuid(),
        email: "rileypaul96@gmail.com",
        githubId: 71047303,
        githubUsername: "rjp301",
        name: "Riley Paul",
        avatarUrl: "https://avatars.githubusercontent.com/u/71047303?v=4",
      },
      {
        id: uuid(),
        email: "hello@example.com",
        name: "John Doe",
        avatarUrl: "https://randomuser.me/api/portraits/men/91.jpg",
      },
    ])
    .returning({ id: User.id })
    .then((users) => users.map((user) => user.id));
  console.log("✅ Seeded user");

  await db
    .insert(Todo)
    .values(todoText.map((text) => ({ id: uuid(), userId: userIds[0], text })));
  console.log("✅ Seeded todos");

  await db.insert(SharedTag).values([
    {
      id: uuid(),
      tag: "react",
      userId: userIds[0],
      sharedUserId: userIds[1],
    },
    {
      id: uuid(),
      tag: "shopping",
      userId: userIds[0],
      isPending: false,
      sharedUserId: userIds[1],
    },
    {
      id: uuid(),
      tag: "work",
      userId: userIds[1],
      sharedUserId: userIds[0],
    },
  ]);
}
