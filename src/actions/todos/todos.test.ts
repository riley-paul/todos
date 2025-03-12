import { expect, test } from "vitest";
import * as actions from "./todos.handlers";
import mockApiContext from "../__test__/mock-api-context";

test("returns an array", async () => {
  const todos = await actions.get({ listId: null }, mockApiContext("sdfadf"));
  expect(Array.isArray(todos)).toBe(true);
});
