import { List, ListShare, Todo, User, db } from "astro:db";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
      ...Array.from({ length: 5 }).map(() => ({
        id: uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        avatarUrl: faker.image.avatarGitHub(),
      })),
    ])
    .returning({ id: User.id })
    .then((users) => users.map((user) => user.id));
  console.log("✅ Seeded users");

  const lists = await db
    .insert(List)
    .values(
      Array.from({ length: 20 }).map(() => ({
        id: uuid(),
        userId: faker.helpers.arrayElement(userIds),
        name: capitalize(faker.lorem.word()),
      })),
    )
    .returning();
  console.log("✅ Seeded lists");

  await db.insert(Todo).values(
    Array.from({ length: 150 }).map(() => {
      return {
        id: uuid(),
        userId: faker.helpers.arrayElement(userIds),
        listId: faker.helpers.maybe(
          () => faker.helpers.arrayElement(lists).id,
          { probability: 0.8 },
        ),
        text: faker.lorem.sentence(),
      };
    }),
  );
  console.log("✅ Seeded todos");

  await db.insert(ListShare).values(
    Array.from({ length: 20 }).map(() => ({
      id: uuid(),
      userId: faker.helpers.arrayElement(userIds),
      listId: faker.helpers.arrayElement(lists).id,
      sharedUserId: faker.helpers.arrayElement(userIds),
    })),
  );
}
