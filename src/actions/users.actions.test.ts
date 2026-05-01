import { createDb } from "@/db";
import env from "@/envs-runtime";
import { provisionFixtures } from "@/test/fixtures";
import { beforeEach, describe, it } from "vitest";
import * as actions from "./users.actions";
import { deleteAllData } from "@/db/scripts/delete-all-data";

const db = createDb(env);

describe("users.actions", () => {
  beforeEach(() => {
    deleteAllData();
    provisionFixtures(db);
  });

  describe("populate", () => {
    it("should return the current user and other users in the same lists", async () => {});
    it("should exlude users that don't share a list with the current user", async () => {});
  });
  describe("update", () => {
    it("should update the user's settings", () => {});
    it("should not effect the settings of other users", () => {});
  });
  describe("remove", () => {
    it("should remove the user", () => {});
    it("should remove user's memberships to lists", () => {});
    it("should not remove user-created todos in shared lists", () => {});
    it("should remove lists the user is the only member of", () => {});
    it("should not remove lists the user shares with others", () => {});
  });
});
