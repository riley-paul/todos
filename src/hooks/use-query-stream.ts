import { type QueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

export default function useQueryStream(queryClient: QueryClient) {
  React.useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryDelay = 1000; // Start with 1 second
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isUnmounted = false;

    const connect = () => {
      eventSource = new EventSource("/stream");

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data === "invalidate") {
          console.log("Invalidating queries");
          queryClient.invalidateQueries();
        }
      };

      eventSource.onopen = () => {
        toast.success("EventSource connected");
        retryDelay = 1000;
      }

      eventSource.onerror = () => {
        toast.error("EventSource error, attempting to reconnect...");
        eventSource?.close();

        // Attempt to reconnect with exponential backoff
        if (!isUnmounted) {
          reconnectTimeout = setTimeout(() => {
            retryDelay = Math.min(retryDelay * 2, 30000); // Max delay of 30 seconds
            connect();
          }, retryDelay);
        }
      };
    };

    connect();

    return () => {
      isUnmounted = true;
      eventSource?.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [queryClient]);
}
