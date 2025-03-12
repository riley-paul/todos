import { expect, test, describe, beforeAll, afterAll } from "vitest";
import * as actions from "./todos.handlers";
import mockApiContext from "../__test__/mock-api-context";
import { execSync } from "child_process";
import { rmSync } from "fs";
import db from "@/db";
import { List, Todo, User } from "@/db/schema";
import { isActionError } from "astro:actions";

const USER_ID = crypto.randomUUID();
const LIST1_ID = crypto.randomUUID();
const LIST2_ID = crypto.randomUUID();
const LIST1_LENGTH = 10;
const LIST2_LENGTH = 5;
const INBOX_LENGTH = 3;

const arrayOfLength = (length: number) => Array.from({ length });

describe("todo fetching", () => {
  beforeAll(async () => {
    execSync("npm run db:push:test");

    await db.insert(User).values({
      id: USER_ID,
      email: "test_user@example.com",
      name: "Test User",
    });

    await db
      .insert(List)
      .values({ id: LIST1_ID, name: "Test List 1", userId: USER_ID })
      .returning();

    await db
      .insert(List)
      .values({ id: LIST2_ID, name: "Test List 2", userId: USER_ID })
      .returning();

    const addTodo = (listId: string | null) =>
      db.insert(Todo).values({ userId: USER_ID, listId, text: "Test Todo" });

    await Promise.all(arrayOfLength(LIST1_LENGTH).map(() => addTodo(LIST1_ID)));
    await Promise.all(arrayOfLength(LIST2_LENGTH).map(() => addTodo(LIST2_ID)));
    await Promise.all(arrayOfLength(INBOX_LENGTH).map(() => addTodo(null)));
  });

  afterAll(() => {
    rmSync("test.db", { force: true });
  });

  test("returns all todos in a list", async () => {
    const todos = await actions.get(
      { listId: LIST1_ID },
      mockApiContext(USER_ID),
    );
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBe(LIST1_LENGTH);
  });

  test("returns all todos in the inbox", async () => {
    const todos = await actions.get({ listId: null }, mockApiContext(USER_ID));
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBe(INBOX_LENGTH);
  });

  test("returns todos from all lists in 'all'", async () => {
    const todos = await actions.get({ listId: "all" }, mockApiContext(USER_ID));
    expect(todos.length).toBe(LIST1_LENGTH + LIST2_LENGTH + INBOX_LENGTH);
  });

  test("throws error when list does not exist", async () => {
    try {
      await actions.get({ listId: "nonexistent" }, mockApiContext(USER_ID));
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(isActionError(error)).toBe(true);
      if (isActionError(error)) {
        expect(error.status).toBe(404);
      }
    }
  });
});
