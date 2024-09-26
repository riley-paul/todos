import { List, SharedTag, Todo, User, db } from "astro:db";
import { todoText } from "./seeds/todo-text";

import { v4 as uuid } from "uuid";
import { randomItemFromArray } from "./seeds/helpers";
import { listNames } from "./seeds/list-names";

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
      {
        id: uuid(),
        email: "hello2@example.com",
        name: "Jill Power",
        avatarUrl: "https://randomuser.me/api/portraits/women/27.jpg",
      },
    ])
    .returning({ id: User.id })
    .then((users) => users.map((user) => user.id));
  console.log("✅ Seeded user");

  const lists = await db
    .insert(List)
    .values(
      listNames.map((name) => ({
        id: uuid(),
        userId: randomItemFromArray(userIds),
        name,
      })),
    )
    .returning();

  await db.insert(Todo).values(
    todoText.map((text) => {
      const listId = randomItemFromArray([
        null,
        null,
        randomItemFromArray(lists).id,
      ]);
      return {
        id: uuid(),
        userId: userIds[0],
        listId,
        text,
      };
    }),
  );
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
    {
      id: uuid(),
      tag: "house",
      userId: userIds[1],
      isPending: false,
      sharedUserId: userIds[0],
    },
    {
      id: uuid(),
      tag: "chores",
      userId: userIds[1],
      sharedUserId: userIds[0],
    },
    {
      id: uuid(),
      tag: "house",
      userId: userIds[2],
      isPending: false,
      sharedUserId: userIds[0],
    },
    {
      id: uuid(),
      tag: "chores",
      userId: userIds[0],
      sharedUserId: userIds[2],
    },
  ]);
}
