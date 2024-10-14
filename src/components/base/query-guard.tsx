import React from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import ErrorPage from "@/app/error-page";

// Define the props type, where each query result can have a different type
interface QueryResultsProps<T> {
  query: UseQueryResult<T, unknown>;
  children: (results: T) => React.ReactNode;
  noDataString?: string;
}

const QueryGuard = <T,>({
  query,
  children,
  noDataString = "No data found",
}: QueryResultsProps<T>): React.ReactNode => {
  if (query.isLoading) {
    return (
      <div className="flex h-full min-h-32 items-center justify-center">
        <i className="fa-solid fa-circle-nodes animate-spin text-lg text-primary" />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="flex h-full min-h-32 items-center justify-center">
        <ErrorPage
          error={query.error}
          retry={() => query.refetch()}
          notFullHeight
        />
      </div>
    );
  }

  if (!query.data || (Array.isArray(query.data) && query.data.length === 0)) {
    return (
      <div className="flex h-full min-h-32 items-center justify-center text-xs text-muted-foreground">
        {noDataString}
      </div>
    );
  }

  return <>{children(query.data)}</>;
};

export default QueryGuard;
