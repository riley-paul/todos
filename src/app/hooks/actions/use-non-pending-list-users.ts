import { useGetMeSuspenseQuery, type ShallowListFragment } from "@/app/gql.gen";

export default function useNonPendingListUsers(list: ShallowListFragment) {
  const {
    data: { me },
  } = useGetMeSuspenseQuery();

  return list.users
    .filter(({ isPending }) => !isPending)
    .filter(({ user }) => user.id !== me.id)
    .map(({ user }) => user);
}
