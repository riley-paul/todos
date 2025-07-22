import { test, describe, beforeAll, afterAll, expect } from "vitest";
import { execSync } from "child_process";
import { rmSync } from "fs";
import { List, ListUser, User } from "@/db/schema";
import { deleteAllData } from "@/db/scripts/delete-all-data";
import { createDb } from "@/db";
import env from "@/envs-runtime";
import listHandlers from "./lists.handlers";
import mockApiContext from "../__test__/mock-api-context";
import actionErrors from "../errors";
import { count, eq } from "drizzle-orm";

const USER1_ID = crypto.randomUUID();
const USER2_ID = crypto.randomUUID();

const LIST1_ID = crypto.randomUUID();
const LIST2_ID = crypto.randomUUID();
const LIST3_ID = crypto.randomUUID();

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
    { userId: USER1_ID, listId: LIST1_ID, isAdmin: true, isPending: false },
    { userId: USER1_ID, listId: LIST2_ID, isAdmin: true, isPending: false },
    { userId: USER2_ID, listId: LIST3_ID, isAdmin: true, isPending: false },
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


describe("List fetching", () => {

  test("get all lists for a user", async () => {
    const result = await listHandlers.getAll({}, mockApiContext(USER1_ID));
    expect(result.length).toBe(2);
  })



})


describe("List creation", () => {
  test("able to create a list", async () => {
    const result = await listHandlers.create(
      { name: "New Test List" },
      mockApiContext(USER1_ID),
    );
    expect(result).toEqual({
      id: expect.any(String),
      name: "New Test List",
    });
    const [list] = await db
      .select({ id: List.id, name: List.name })
      .from(List)
      .where(eq(List.id, result.id));
    expect(list).toEqual({
      id: result.id,
      name: "New Test List",
    });
  });
});

describe("List deletion", () => {
  test("able to delete a list if admin", async () => {
    const [{ numListsBefore }] = await db
      .select({ numListsBefore: count() })
      .from(List);
    const result = await listHandlers.remove(
      { id: LIST1_ID },
      mockApiContext(USER1_ID),
    );
    const [{ numListsAfter }] = await db
      .select({ numListsAfter: count() })
      .from(List);

    expect(result).toBe(null);
    expect(numListsBefore - numListsAfter).toBe(1);
  });

  test("unable to delete a list if not list admin", async () => {
    await expect(() =>
      listHandlers.remove({ id: LIST3_ID }, mockApiContext(USER1_ID)),
    ).rejects.toThrow(actionErrors.NO_PERMISSION);
  });

  test("throws error when list does not exist", async () => {
    await expect(() =>
      listHandlers.remove({ id: "nonexistent" }, mockApiContext(USER1_ID)),
    ).rejects.toThrow(actionErrors.NOT_FOUND);
  });
});
