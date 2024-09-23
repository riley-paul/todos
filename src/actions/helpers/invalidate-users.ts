import InvalidationController from "@/lib/invalidation-controller";

export default function invalidateUsers(userIds: string[]) {
  InvalidationController.getInstance().invalidateKey(userIds);
}
