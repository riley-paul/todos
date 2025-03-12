import { expect, test, describe, beforeAll, afterAll } from "vitest";
import * as actions from "./todos.handlers";
import mockApiContext from "../__test__/mock-api-context";
import { execSync } from "child_process";
import { rmSync } from "fs";
import db from "@/db";
import { List, ListShare, Todo, User } from "@/db/schema";
import { ActionError } from "astro:actions";
import { eq } from "drizzle-orm";
import { deleteAllData } from "@/db/scripts";

const USER1_ID = crypto.randomUUID();
const USER2_ID = crypto.randomUUID();

const LIST1_ID = crypto.randomUUID();
const LIST2_ID = crypto.randomUUID();
const LIST3_ID = crypto.randomUUID();

const LIST1_LENGTH = 10;
const LIST2_LENGTH = 5;
const LIST3_LENGTH = 17;
const INBOX_LENGTH = 3;

const USER1_LENGTH = LIST1_LENGTH + LIST2_LENGTH + INBOX_LENGTH;

const LIST_SHARE_ID = crypto.randomUUID();

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
      { id: LIST1_ID, name: "Test List 1", userId: USER1_ID },
      { id: LIST2_ID, name: "Test List 2", userId: USER1_ID },
      { id: LIST3_ID, name: "Test List 3", userId: USER2_ID },
    ])
    .returning();

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
    ...Array.from({ length: INBOX_LENGTH }, () => ({
      userId: USER1_ID,
      listId: null,
      text: "Inbox todo",
    })),
    ...Array.from({ length: LIST3_LENGTH }, () => ({
      userId: USER2_ID,
      listId: LIST3_ID,
      text: "Other users todo",
    })),
  ]);

  await db.insert(ListShare).values({
    id: LIST_SHARE_ID,
    userId: USER2_ID,
    listId: LIST3_ID,
    sharedUserId: USER1_ID,
    isPending: true,
  });
});

afterAll(() => {
  rmSync("test.db", { force: true });
});

describe("todo fetching", () => {
  test("returns all todos in a list", async () => {
    const todos = await actions.get(
      { listId: LIST1_ID },
      mockApiContext(USER1_ID),
    );
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBe(LIST1_LENGTH);
  });

  test("returns all todos in the inbox", async () => {
    const todos = await actions.get({ listId: null }, mockApiContext(USER1_ID));
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBe(INBOX_LENGTH);
  });

  test("returns todos from all lists in 'all'", async () => {
    const todos = await actions.get(
      { listId: "all" },
      mockApiContext(USER1_ID),
    );
    expect(todos.length).toBe(USER1_LENGTH);
  });

  test("throws error when list does not exist", async () => {
    await expect(() =>
      actions.get({ listId: "nonexistent" }, mockApiContext(USER1_ID)),
    ).rejects.toThrow(ActionError);
  });

  test("includes shared todos in 'all' when share accepted", async () => {
    await db
      .update(ListShare)
      .set({ isPending: false })
      .where(eq(ListShare.id, LIST_SHARE_ID));

    const inboxTodos = await actions.get(
      { listId: "all" },
      mockApiContext(USER1_ID),
    );
    expect(inboxTodos.length).toBe(USER1_LENGTH + LIST3_LENGTH);
  });
});

describe("todo creation", () => {
  test("creates a todo", async () => {
    const result = await actions.create(
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

  test("throws error when list does not exist", async () => {
    await expect(() =>
      actions.create(
        {
          data: {
            listId: "nonexistent",
            text: "New Todo",
            isCompleted: false,
          },
        },
        mockApiContext(USER1_ID),
      ),
    ).rejects.toThrow(ActionError);
  });

  test("throw error when user is not allowed to create a todo in list", async () => {
    await db
      .update(ListShare)
      .set({ isPending: true })
      .where(eq(ListShare.id, LIST_SHARE_ID));

    await expect(() =>
      actions.create(
        {
          data: {
            listId: LIST3_ID,
            text: "New Todo",
            isCompleted: false,
          },
        },
        mockApiContext(USER1_ID),
      ),
    ).rejects.toThrow(ActionError);
  });
});
