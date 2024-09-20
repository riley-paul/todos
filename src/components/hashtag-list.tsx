import { useQuery } from "@tanstack/react-query";
import React from "react";
import { hashtagQueryOptions } from "../lib/queries";
import Hashtag from "./hashtag";
import useSelectedTag from "@/hooks/use-selected-tag";

const HashtagList: React.FC = () => {
  const { tag } = useSelectedTag();
  const hashtagQuery = useQuery(hashtagQueryOptions);
  const hashtags = hashtagQuery.data ?? [];

  if (hashtags.length === 0 || hashtags.every((hashtag) => hashtag === "~")) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {hashtags.map((hashtag) => (
        <Hashtag key={hashtag} hashtag={hashtag} />
      ))}
      {!hashtags.includes(tag) && tag && <Hashtag hashtag={tag} isGhost />}
    </div>
  );
};

export default HashtagList;
