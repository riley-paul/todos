import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  // beforeLoad: async ({ context, location }) => {
  //   const { queryClient } = context;
  //   await queryClient
  //     .fetchQuery(userQueryOptions)
  //     .then((data) => {
  //       if (!data) {
  //         throw redirect({ to: "/welcome" });
  //       }
  //     })
  //     .catch(() => {
  //       throw redirect({ to: "/welcome" });
  //     });
  // },
});
