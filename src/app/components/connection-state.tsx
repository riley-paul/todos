import { cn } from "@/app/lib/utils";
import { Tooltip } from "@radix-ui/themes";
import { useAbly, useConnectionStateListener } from "ably/react";
import { useState } from "react";

type ConnectionDotProps = { className: string; title: string };

const ConnectionDot: React.FC<ConnectionDotProps> = ({ className, title }) => (
  <Tooltip content={title} side="top">
    <div className={cn("size-2 rounded-full", className)} />
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
      return <ConnectionDot className="bg-green-10" title="Connected" />;
    case "closed":
      return <ConnectionDot className="bg-red-10" title="Disconnected" />;
    case "disconnected":
      return <ConnectionDot className="bg-red-10" title="Disconnected" />;
    case "failed":
      return <ConnectionDot className="bg-red-10" title="Failed" />;
    default:
      return <ConnectionDot className="bg-amber-10" title="Connecting..." />;
  }
};

export default ConnectionState;
