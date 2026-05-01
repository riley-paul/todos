import type { Db } from "@/db";
import * as tables from "@/db/schema";
import { faker } from "@faker-js/faker";

export const provisionFixtures = async (db: Db) => {
  const [mainUser] = await db
    .insert(tables.User)
    .values({ name: "Main User", email: faker.internet.email() })
    .returning();

  const [collaboratingUser] = await db
    .insert(tables.User)
    .values({ name: "Collaborating User", email: faker.internet.email() })
    .returning();

  const [outsideUser] = await db
    .insert(tables.User)
    .values({ name: "Outside User", email: faker.internet.email() })
    .returning();

  return {
    mainUser,
    collaboratingUser,
    outsideUser,
  };
};
