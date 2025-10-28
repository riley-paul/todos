import React from "react";
import Empty from "../ui/empty";
import { SearchSlashIcon } from "lucide-react";

const NoSearchResultsScreen: React.FC = () => {
  return (
    <Empty.Root>
      <Empty.Header>
        <Empty.Media variant="icon">
          <SearchSlashIcon />
        </Empty.Media>
        <Empty.Title>No Search Results</Empty.Title>
        <Empty.Description>
          We couldn't find any items matching your search. Try adjusting your
          search terms and try again.
        </Empty.Description>
      </Empty.Header>
    </Empty.Root>
  );
};

export default NoSearchResultsScreen;
