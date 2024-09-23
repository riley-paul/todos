import { type QueryClient } from "@tanstack/react-query";
import React from "react";

export default function useQueryStream(queryClient: QueryClient) {
  React.useEffect(() => {
    const eventSource = new EventSource("/stream");

    const messageListener = (event: MessageEvent) => {
      console.log(event.data);
      if (event.data === "invalidate") {
        queryClient.invalidateQueries();
      }
    };

    const errorListener = (event: MessageEvent) => {
      console.error(event);
      eventSource.close();
    };

    eventSource.addEventListener("message", messageListener);
    eventSource.addEventListener("error", errorListener);

    return () => {
      eventSource.removeEventListener("message", messageListener);
      eventSource.removeEventListener("error", errorListener);
      eventSource.close();
    };
  }, []);
}
