import { useQuery } from "@tanstack/react-query";
import React from "react";
import { hashtagQueryOptions } from "../lib/queries";
import Hashtag from "./hashtag";

const HashtagList: React.FC = () => {
  const hashtagQuery = useQuery(hashtagQueryOptions);
  const hashtags = hashtagQuery.data ?? [];

  if (
    hashtags.length === 0 ||
    hashtags.every((hashtag) => hashtag.tag === "~")
  ) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5 px-3">
      {hashtags.map((hashtag) => (
        <Hashtag key={hashtag.tag} hashtag={hashtag} />
      ))}
    </div>
  );
};

export default HashtagList;
