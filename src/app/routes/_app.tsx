import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { userQueryOptions } from "../lib/queries";
import Header from "../components/header";

const Component: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <div className="container2">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ location, context }) => {
    // @ts-ignore
    const { queryClient } = context;
    const me = await queryClient.ensureQueryData(userQueryOptions);
    if (!me) {
      throw redirect({
        to: "/welcome",
        search: { redirect: location.href },
      });
    }
  },
  component: Component,
});
