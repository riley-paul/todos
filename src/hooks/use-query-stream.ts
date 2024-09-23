import { type QueryKey, type QueryClient } from "@tanstack/react-query";
import React from "react";
import { z } from "zod";

const queryKeySchema = z.custom<QueryKey>();

export default function useQueryStream(queryClient: QueryClient) {
  React.useEffect(() => {
    const eventSource = new EventSource("/stream");

    const messageListener = (event: MessageEvent) => {
      console.log(event.data);
      const data = JSON.parse(event.data);
      const queryKey = queryKeySchema.safeParse(data);
      if (!queryKey.success) return;
      queryClient.setQueryData(queryKey.data, data.data);
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
