import React from "react";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import useSelectedTag from "../hooks/use-selected-tag";
import { Link } from "react-router-dom";
import type { TagSelect } from "@/lib/types";
import { Link2 } from "lucide-react";

type Props = {
  hashtag: TagSelect;
  isGhost?: boolean;
};

const Hashtag: React.FC<Props> = (props) => {
  const { hashtag, isGhost } = props;

  const { tag } = useSelectedTag();
  const isActive = tag === hashtag.tag;

  return (
    <Link
      to={isActive ? "/" : `/?tag=${hashtag.tag}`}
      title={hashtag.tag === "~" ? "No tag" : `Tag: ${hashtag}`}
      className={cn(isGhost && "opacity-50")}
    >
      <Badge
        variant={isActive ? "default" : "secondary"}
        className={cn(
          isGhost && "outline-dashed",
          "flex items-center gap-1",
        )}
      >
        {hashtag.tag}
        {hashtag.isShared && <Link2 className="size-4" />}
      </Badge>
    </Link>
  );
};

export default Hashtag;
