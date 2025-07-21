import { Text, Tooltip, type ThemeProps } from "@radix-ui/themes";
import { useAbly, useConnectionStateListener } from "ably/react";
import { CircleIcon } from "lucide-react";
import { useState } from "react";

type ConnectionDotProps = { color: ThemeProps["accentColor"]; title: string };

const ConnectionDot: React.FC<ConnectionDotProps> = ({ color, title }) => (
  <Tooltip content={title} side="top">
    <Text color={color}>
      <CircleIcon className="size-3" />
    </Text>
  </Tooltip>
);

const ConnectionState: React.FC = () => {
  const ably = useAbly();
  const [connectionState, setConnectionState] = useState(ably.connection.state);

  useConnectionStateListener((stateChange) => {
    setConnectionState(stateChange.current);
  });

  switch (connectionState) {
    case "connected":
      return <ConnectionDot color="green" title="Connected" />;
    case "closed":
      return <ConnectionDot color="red" title="Disconnected" />;
    case "disconnected":
      return <ConnectionDot color="red" title="Disconnected" />;
    case "failed":
      return <ConnectionDot color="red" title="Failed" />;
    default:
      return <ConnectionDot color="amber" title="Connecting..." />;
  }
};

export default ConnectionState;
