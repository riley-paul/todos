import { type ShallowListFragment } from "@/app/gql.gen";
import { useUser } from "@/app/providers/user-provider";

export default function useNonPendingListUsers(list: ShallowListFragment) {
  const me = useUser();
  return list.users
    .filter(({ isPending }) => !isPending)
    .filter(({ user }) => user.id !== me.id)
    .map(({ user }) => user);
}
