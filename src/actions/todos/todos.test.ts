import { expect, test, describe, beforeAll, afterAll } from "vitest";
import * as actions from "./todos.handlers";
import mockApiContext from "../__test__/mock-api-context";
import { execSync } from "child_process";
import { rmSync } from "fs";
import db from "@/db";
import { List, Todo, User } from "@/db/schema";

const USER_ID = crypto.randomUUID();
const LIST_ID = crypto.randomUUID();

describe("todos actions", () => {
  beforeAll(async () => {
    execSync("npm run db:push:test");

    await db.insert(User).values({
      id: USER_ID,
      email: "test_user@example.com",
      name: "Test User",
    });

    await db
      .insert(List)
      .values({ id: LIST_ID, name: "Test List", userId: USER_ID })
      .returning();

    const addTodo = () =>
      db
        .insert(Todo)
        .values({ userId: USER_ID, listId: LIST_ID, text: "Test Todo" });

    await Promise.all(Array.from({ length: 10 }, addTodo));
  });

  afterAll(() => {
    rmSync("test.db", { force: true });
  });

  test("returns an array", async () => {
    const todos = await actions.get(
      { listId: LIST_ID },
      mockApiContext(USER_ID),
    );
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBe(10);
  });
});
