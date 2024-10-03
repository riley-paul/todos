import React from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Define the props type, where each query result can have a different type
interface QueryResultsProps<T extends any[]> {
  queries: { [K in keyof T]: UseQueryResult<T[K], unknown> }; // Queries is a tuple of UseQueryResult
  children: (results: T) => React.ReactNode; // Callback function to render React Node with results
}

const QueryGuard = <T extends any[]>({
  queries,
  children,
}: QueryResultsProps<T>) => {
  const isLoading = queries.some((query) => query.isLoading);
  const error = queries.find((query) => query.isError)?.error;

  if (isLoading) {
    return (
      <div className="flex h-full min-h-32 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-32 items-center justify-center text-sm text-muted-foreground">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  // Once all queries are done loading and have no errors, pass the data to the children callback
  const results = queries.map((query) => query.data!) as T; // Ensure correct tuple type

  return <>{children(results)}</>;
};

export default QueryGuard;
