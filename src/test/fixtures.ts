import type { Db } from "@/db";
import * as tables from "@/db/schema";
import { faker } from "@faker-js/faker";
import type { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof tables.User>;
type List = InferSelectModel<typeof tables.List>;
type Todo = InferSelectModel<typeof tables.Todo>;

export type Fixtures = {
  mainUser: User;
  collaboratingUser: User;
  outsideUser: User;

  mainUserSharedList: List;
  mainUserUnsharedList: List;
  outsideUserList: List;

  sharedListTodos: Todo[];
  unsharedListTodos: Todo[];
  outsideListTodos: Todo[];
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

  const sharedListTodos = await db
    .insert(tables.Todo)
    .values([
      {
        userId: mainUser.id,
        listId: mainUserSharedList.id,
        text: "Shared todo 1",
        isCompleted: false,
      },
      {
        userId: mainUser.id,
        listId: mainUserSharedList.id,
        text: "Shared todo 2",
        isCompleted: true,
      },
      {
        userId: collaboratingUser.id,
        listId: mainUserSharedList.id,
        text: "Shared todo 3",
        isCompleted: false,
      },
      {
        userId: collaboratingUser.id,
        listId: mainUserSharedList.id,
        text: "Shared todo 4",
        isCompleted: true,
      },
    ])
    .returning();

  const unsharedListTodos = await db
    .insert(tables.Todo)
    .values([
      {
        userId: mainUser.id,
        listId: mainUserUnsharedList.id,
        text: "Unshared todo 1",
        isCompleted: false,
      },
      {
        userId: mainUser.id,
        listId: mainUserUnsharedList.id,
        text: "Unshared todo 2",
        isCompleted: true,
      },
      {
        userId: mainUser.id,
        listId: mainUserUnsharedList.id,
        text: "Unshared todo 3",
        isCompleted: false,
      },
      {
        userId: mainUser.id,
        listId: mainUserUnsharedList.id,
        text: "Unshared todo 4",
        isCompleted: true,
      },
    ])
    .returning();

  const outsideListTodos = await db
    .insert(tables.Todo)
    .values([
      {
        userId: outsideUser.id,
        listId: outsideUserList.id,
        text: "Outside todo 1",
        isCompleted: false,
      },
      {
        userId: outsideUser.id,
        listId: outsideUserList.id,
        text: "Outside todo 2",
        isCompleted: true,
      },
      {
        userId: outsideUser.id,
        listId: outsideUserList.id,
        text: "Outside todo 3",
        isCompleted: false,
      },
      {
        userId: outsideUser.id,
        listId: outsideUserList.id,
        text: "Outside todo 4",
        isCompleted: true,
      },
    ])
    .returning();

  return {
    mainUser,
    collaboratingUser,
    outsideUser,

    mainUserSharedList,
    mainUserUnsharedList,
    outsideUserList,

    sharedListTodos,
    unsharedListTodos,
    outsideListTodos,
  };
};
