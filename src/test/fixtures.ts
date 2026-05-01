import type { Db } from "@/db";
import * as tables from "@/db/schema";
import { faker } from "@faker-js/faker";
import type { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof tables.User>;

export type Fixtures = {
  mainUser: User;
  collaboratingUser: User;
  outsideUser: User;
};

export const provisionFixtures = async (db: Db): Promise<Fixtures> => {
  const [mainUser, collaboratingUser, outsideUser] = await db
    .insert(tables.User)
    .values([
      { name: "Main User", email: faker.internet.email() },
      { name: "Collaborating User", email: faker.internet.email() },
      { name: "Outside User", email: faker.internet.email() },
    ])
    .returning();

  if (!mainUser || !collaboratingUser || !outsideUser) {
    throw new Error("provisionFixtures: failed to insert one or more users");
  }

  return { mainUser, collaboratingUser, outsideUser };
};
