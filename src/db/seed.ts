import { faker } from "@faker-js/faker";
import { List, ListUser, Todo, User } from "./schema";
import { createDb } from ".";
import env from "@/envs-runtime";
import { deleteAllData } from "./scripts/delete-all-data";

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// https://astro.build/db/seed
export default async function seed() {
  const db = createDb(env);

  await deleteAllData();
  console.log("✅ Deleted all data");

  const userIds = await db
    .insert(User)
    .values([
      {
        email: "rileypaul96@gmail.com",
        githubId: 71047303,
        githubUsername: "rjp301",
        name: "Riley Paul",
        avatarUrl: "https://avatars.githubusercontent.com/u/71047303?v=4",
      },
      ...Array.from({ length: 20 }).map(() => ({
        email: faker.internet.email(),
        name: faker.person.fullName(),
        avatarUrl: faker.image.avatarGitHub(),
      })),
    ])
    .returning({ id: User.id })
    .then((users) => users.map((user) => user.id));
  console.log("✅ Seeded users");

  userIds.forEach(async (userId) => {
    const listIds = await db
      .insert(List)
      .values(
        Array.from({ length: faker.number.int({ min: 5, max: 10 }) }).map(
          () => ({
            userId,
            name: capitalize(faker.lorem.word()),
          }),
        ),
      )
      .returning()
      .then((lists) => lists.map((list) => list.id));

    listIds.forEach(async (listId) => {
      await db.insert(ListUser).values({
        userId,
        listId,
        isAdmin: true,
        isPending: false,
      });
      const isShared = faker.helpers.maybe(() => true, { probability: 0.3 });
      if (!isShared) return;

      const sharedUserIds = faker.helpers.arrayElements(
        userIds.filter((id) => id !== userId),
        faker.number.int(7),
      );

      sharedUserIds.forEach(async (sharedUserId) => {
        await db.insert(ListUser).values({
          userId: sharedUserId,
          listId,
          isPending: Math.random() > 0.2,
        });
      });
    });

    await db.insert(Todo).values(
      Array.from({ length: 50 }).map(() => {
        return {
          userId,
          listId: faker.helpers.maybe(
            () => faker.helpers.arrayElement(listIds),
            { probability: 0.8 },
          ),
          text: faker.lorem.sentence(),
        };
      }),
    );
  });
  console.log("✅ Seeded data for users");
}

seed();
