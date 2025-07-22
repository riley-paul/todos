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

  const listIds = await db
    .insert(List)
    .values(
      Array.from({ length: 120 }).map(() => ({
        name: capitalize(faker.lorem.word()),
      })),
    )
    .returning({ id: List.id })
    .then((lists) => lists.map(({ id }) => id));
  console.log("✅ Seeded lists");

  listIds.forEach(async (listId) => {
    // Assign a random user as the admin of the list
    const [{ userId: adminUserId }] = await db
      .insert(ListUser)
      .values({
        userId: faker.helpers.arrayElement(userIds),
        listId,
        isAdmin: true,
        isPending: false,
      })
      .returning({ userId: ListUser.userId });

    // Assign random users to the list
    const listUserIds = faker.helpers.arrayElements(
      userIds,
      faker.number.int(4),
    );
    if (listUserIds.length > 0) {
      await db.insert(ListUser).values(
        listUserIds.map((userId) => ({
          userId,
          listId,
          isAdmin: faker.datatype.boolean(0.2), // Randomly assign admin status
          isPending: faker.datatype.boolean(0.2), // Randomly assign pending status
        })),
      );
    }

    // Create todos for the list
    const numTodos = faker.number.int(30);
    const todoUserIds = [...listUserIds, adminUserId];
    if (numTodos > 0) {
      await db.insert(Todo).values(
        Array.from({ length: numTodos }).map(() => ({
          userId: faker.helpers.arrayElement(todoUserIds),
          listId,
          text: faker.lorem.sentence(),
        })),
      );
    }
  });
  console.log("✅ Seeded list data");

  await db.insert(Todo).values(
    Array.from({ length: 300 }).map(() => ({
      userId: faker.helpers.arrayElement(userIds),
      text: faker.lorem.sentence(),
      isCompleted: faker.datatype.boolean(),
    })),
  );
  console.log("✅ Seeded additional todos");
}

seed();
