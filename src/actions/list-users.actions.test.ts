import { describe, it } from "vitest";

describe("list-users.actions", () => {
  describe("populate", () => {
    it("should return listusers associated with lists the user belongs to", () => {});
    it("should not return listusers associated with lists the user doesn't belong to", () => {});
  });
  describe("acceptInvite", () => {
    it("should change the status of the listuser to accepted", () => {});
    it("should not allow accepting an invite for a list the user doesn't belong to", () => {});
    it("should not allow accepting an invite for a list that isn't pending", () => {});
  });
  describe("leaveList", () => {
    it("should remove the user from the list", () => {});
    it("should not allow leaving a list the user doesn't belong to", () => {});
  });
  describe("inviteToList", () => {
    it("should create a pending listuser for the invited user", () => {});
    it("should not allow inviting a user to a list the inviter doesn't belong to", () => {});
    it("should not allow a pending user to invite another user", () => {});
    it("should not allow inviting a user that doesn't exist", () => {});
    it("should not allow inviting a user that is already a member", () => {});
  });
  describe("removeFromList", () => {
    it("should remove the specified user from the list", () => {});
    it("should not allow removing a user from a list the remover doesn't belong to", () => {});
  });
});
