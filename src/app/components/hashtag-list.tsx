import { useQuery } from "@tanstack/react-query";
import React from "react";
import { hashtagQueryOptions } from "../lib/queries";
import Hashtag from "./hashtag";

const HashtagList: React.FC = () => {
  const hashtagQuery = useQuery(hashtagQueryOptions);

  if (!hashtagQuery.data) {
    return null;
  }

  return (
    hashtagQuery.data.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        <Hashtag hashtag="~" />
        {hashtagQuery.data.map((hashtag) => (
          <Hashtag key={hashtag} hashtag={hashtag} />
        ))}
      </div>
    )
  );
};

export default HashtagList;
