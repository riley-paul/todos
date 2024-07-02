import { Link, useSearch } from "@tanstack/react-router";
import React from "react";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

type Props = {
  hashtag: string;
};

const Hashtag: React.FC<Props> = (props) => {
  const { hashtag } = props;

  const { tags } = useSearch({ from: "/_app/" });
  const isActive = tags?.includes(hashtag);

  return (
    <Link
      to="/"
      search={(prev) => {
        const prevTags = prev.tags ?? [];
        const isActive = prevTags.includes(hashtag);

        if (isActive && prevTags.length === 1) {
          return { ...prev, tags: undefined };
        }

        if (prevTags.includes(hashtag)) {
          return { ...prev, tags: prevTags.filter((tag) => tag !== hashtag) };
        }

        return { ...prev, tags: [...prevTags, hashtag] };
      }}
    >
      <Badge
        variant="secondary"
        className={cn(isActive && "outline outline-primary")}
      >
        {hashtag}
      </Badge>
    </Link>
  );
};

export default Hashtag;
