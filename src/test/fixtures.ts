import type { Db } from "@/db";
import * as tables from "@/db/schema";
import { faker } from "@faker-js/faker";
import type { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof tables.User>;
type List = InferSelectModel<typeof tables.List>;

export type Fixtures = {
  mainUser: User;
  collaboratingUser: User;
  outsideUser: User;

  mainUserSharedList: List;
  mainUserUnsharedList: List;
  outsideUserList: List;
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

  const [mainUserSharedList, mainUserUnsharedList, outsideUserList] = await db
    .insert(tables.List)
    .values([
      { name: "Main User Shared List" },
      { name: "Main User Unshared List" },
      { name: "Outside User List" },
    ])
    .returning();

  if (!mainUserSharedList || !mainUserUnsharedList || !outsideUserList) {
    throw new Error("provisionFixtures: failed to insert one or more lists");
  }

  await db.insert(tables.ListUser).values([
    {
      listId: mainUserSharedList.id,
      userId: mainUser.id,
      isPending: false,
    },
    {
      listId: mainUserSharedList.id,
      userId: collaboratingUser.id,
      isPending: false,
    },
    {
      listId: mainUserUnsharedList.id,
      userId: mainUser.id,
      isPending: false,
    },
    {
      listId: outsideUserList.id,
      userId: outsideUser.id,
      isPending: false,
    },
  ]);

  return {
    mainUser,
    collaboratingUser,
    outsideUser,

    mainUserSharedList,
    mainUserUnsharedList,
    outsideUserList,
  };
};
