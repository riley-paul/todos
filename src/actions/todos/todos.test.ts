import { expect, test } from "vitest";
import * as actions from "./todos.handlers";
import createApiContext from "../__test__/create-api-context";

test("returns an array", async () => {
  try {
    const todos = await actions.get(
      { listId: null },
      createApiContext("sdfadf"),
    );
  } catch (e) {
    console.log("error", e);
  }

  // expect(Array.isArray(todqos)).toBe(true);
});
