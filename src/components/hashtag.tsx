import React from "react";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import useSelectedTag from "../hooks/use-selected-tag";

type Props = {
  hashtag: string;
  isGhost?: boolean;
};

const Hashtag: React.FC<Props> = (props) => {
  const { hashtag, isGhost } = props;

  const { tag, toggleTag } = useSelectedTag();
  const isActive = tag === hashtag;

  return (
    <button
      onClick={() => toggleTag(hashtag)}
      title={hashtag === "~" ? "No tag" : `Tag: ${hashtag}`}
      className={cn(isGhost && "opacity-50")}
    >
      <Badge
        variant="secondary"
        className={cn(
          isActive && "outline outline-2 outline-primary",
          isGhost && "outline-dashed",
        )}
      >
        {hashtag}
      </Badge>
    </button>
  );
};

export default Hashtag;
