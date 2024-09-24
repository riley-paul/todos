import { type QueryClient } from "@tanstack/react-query";
import React from "react";

export default function useQueryStream(queryClient: QueryClient) {
  React.useEffect(() => {
    const eventSource = new EventSource("/stream");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data === "invalidate") {
        console.log("Invalidating queries");
        queryClient.invalidateQueries();
      }
    };

    eventSource.onerror = (event) => {
      console.error(event);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);
}
