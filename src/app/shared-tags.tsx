import SharedTagCreator from "@/components/shared-tag-creator";
import SharedTagList from "@/components/shared-tag-list";
import React from "react";

const SharedTags: React.FC = () => {
  return (
    <div className="grid gap-6">
      <SharedTagCreator />
      <SharedTagList />
    </div>
  );
};

export default SharedTags;
