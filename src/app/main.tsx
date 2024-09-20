import React from "react";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "sonner";
import ErrorPage from "@/components/error-page";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Root from "./root";
import { TooltipProvider } from "@/components/ui/tooltip";
import SharedTags from "./shared-tags";
import Header from "@/components/header";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  mutationCache: new MutationCache({
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  }),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <main className="container2">
          <Outlet />
        </main>
      </>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Root />,
      },
      {
        path: "shared",
        element: <SharedTags />,
      },
    ],
  },
]);

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RouterProvider router={router} />
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
