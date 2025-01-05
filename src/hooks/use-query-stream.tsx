import { Text, Tooltip, type TextProps } from "@radix-ui/themes";
import { type QueryClient } from "@tanstack/react-query";
import React from "react";

type StreamState = "connecting" | "connected" | "disconnected";

const getStreamStateIconColor = (
  streamState: StreamState,
): TextProps["color"] => {
  switch (streamState) {
    case "connecting":
      return "gray";
    case "connected":
      return "green";
    case "disconnected":
      return "red";
  }
};

const getStreamStateDescription = (streamState: StreamState): string => {
  switch (streamState) {
    case "connecting":
      return "Connecting...";
    case "connected":
      return "Connected";
    case "disconnected":
      return "Disconnected";
  }
};

export default function useQueryStream(queryClient: QueryClient) {
  const [streamState, setStreamState] =
    React.useState<StreamState>("connecting");

  const StreamStateIcon: React.FC = () => {
    return (
      <Tooltip content={getStreamStateDescription(streamState)} side="right">
        <Text size="1" color={getStreamStateIconColor(streamState)}>
          <i className="fa-solid fa-circle fa-sm" />
        </Text>
      </Tooltip>
    );
  };

  React.useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryDelay = 1_000; // Start with 1 second
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
        console.log("EventSource connected");
        setStreamState("connected");
        retryDelay = 1_000;
      };

      eventSource.onerror = () => {
        console.error("EventSource error, attempting to reconnect...");
        setStreamState("disconnected");
        eventSource?.close();

        // Attempt to reconnect with exponential backoff
        if (!isUnmounted) {
          reconnectTimeout = setTimeout(() => {
            retryDelay = Math.min(retryDelay * 2, 30_000); // Max delay of 30 seconds
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
      setStreamState("disconnected");
    };
  }, [queryClient]);

  return { StreamStateIcon };
}
