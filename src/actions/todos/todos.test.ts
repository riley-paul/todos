import { expect, test, describe, beforeAll, afterAll } from "vitest";
import mockApiContext from "../__test__/mock-api-context";
import { execSync } from "child_process";
import { rmSync } from "fs";
import { List, ListUser, Todo, User } from "@/db/schema";
import { eq } from "drizzle-orm";
import { deleteAllData } from "@/db/scripts/delete-all-data";
import actionErrors from "../errors";
import * as todoHanders from "./todos.handlers";
import { createDb } from "@/db";
import env from "@/envs-runtime";

const USER1_ID = crypto.randomUUID();
const USER2_ID = crypto.randomUUID();

const LIST1_ID = crypto.randomUUID();
const LIST2_ID = crypto.randomUUID();
const LIST3_ID = crypto.randomUUID();

const LIST1_LENGTH = 10;
const LIST2_LENGTH = 5;
const LIST3_LENGTH = 17;

const LIST_USER_ID = crypto.randomUUID();

const db = createDb(env);

beforeAll(async () => {
  execSync("npm run db:push:test");
  await deleteAllData();

  await db.insert(User).values([
    {
      id: USER1_ID,
      email: "test_user@example.com",
      name: "Main Test User",
    },
    {
      id: USER2_ID,
      email: "test_user2@example.com",
      name: "Other Test User",
    },
  ]);

  await db
    .insert(List)
    .values([
      { id: LIST1_ID, name: "Test List 1" },
      { id: LIST2_ID, name: "Test List 2" },
      { id: LIST3_ID, name: "Test List 3" },
    ])
    .returning();

  await db.insert(ListUser).values([
    { userId: USER1_ID, listId: LIST1_ID, isPending: false },
    { userId: USER1_ID, listId: LIST2_ID, isPending: false },
    { userId: USER2_ID, listId: LIST3_ID, isPending: false },
  ]);

  await db.insert(Todo).values([
    ...Array.from({ length: LIST1_LENGTH }, () => ({
      userId: USER1_ID,
      listId: LIST1_ID,
      text: "Test Todo",
    })),
    ...Array.from({ length: LIST2_LENGTH }, () => ({
      userId: USER1_ID,
      listId: LIST2_ID,
      text: "Test Todo",
    })),
    ...Array.from({ length: LIST3_LENGTH }, () => ({
      userId: USER2_ID,
      listId: LIST3_ID,
      text: "Other users todo",
    })),
  ]);

  await db.insert(ListUser).values({
    id: LIST_USER_ID,
    userId: USER1_ID,
    listId: LIST3_ID,
    isPending: true,
  });
});

afterAll(() => {
  rmSync("test.db", { force: true });
});

describe("todo fetching", () => {
  test("returns all todos in a list", async () => {
    const todos = await todoHanders.getAll(
      { listId: LIST1_ID },
      mockApiContext(USER1_ID),
    );
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBe(LIST1_LENGTH);
  });

  test("throws error when list does not exist", async () => {
    await expect(() =>
      todoHanders.getAll({ listId: "nonexistent" }, mockApiContext(USER1_ID)),
    ).rejects.toThrow(actionErrors.NOT_FOUND);
  });
});

describe("todo creation", () => {
  test("creates a todo", async () => {
    const result = await todoHanders.create(
      {
        data: {
          listId: LIST1_ID,
          text: "New Todo",
          isCompleted: false,
        },
      },
      mockApiContext(USER1_ID),
    );

    const [todo] = await db.select().from(Todo).where(eq(Todo.id, result.id));
    expect(todo.text).toBe("New Todo");
  });

  test("creates a todo in shared list", async () => {
    await expect(
      todoHanders.create(
        {
          data: {
            listId: LIST3_ID,
            text: "New Todo",
            isCompleted: false,
          },
        },
        mockApiContext(USER1_ID),
      ),
    ).resolves.not.toThrow();
  });

  test("cannot create a todo in a pending shared list", async () => {
    await db
      .update(ListUser)
      .set({ isPending: true })
      .where(eq(ListUser.id, LIST_USER_ID));

    await expect(() =>
      todoHanders.create(
        {
          data: {
            listId: LIST3_ID,
            text: "New Todo",
            isCompleted: false,
          },
        },
        mockApiContext(USER1_ID),
      ),
    ).rejects.toThrow(actionErrors.NO_PERMISSION);
  });

  test("throws error when list does not exist", async () => {
    await expect(() =>
      todoHanders.create(
        {
          data: {
            listId: "nonexistent",
            text: "New Todo",
            isCompleted: false,
          },
        },
        mockApiContext(USER1_ID),
      ),
    ).rejects.toThrow(actionErrors.NOT_FOUND);
  });

  test("throw error when user is not allowed to create a todo in list", async () => {
    await db
      .update(ListUser)
      .set({ isPending: true })
      .where(eq(ListUser.id, LIST_USER_ID));

    await expect(() =>
      todoHanders.create(
        {
          data: {
            listId: LIST3_ID,
            text: "New Todo",
            isCompleted: false,
          },
        },
        mockApiContext(USER1_ID),
      ),
    ).rejects.toThrow(actionErrors.NO_PERMISSION);
  });
});
