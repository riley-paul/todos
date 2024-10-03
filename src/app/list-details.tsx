import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { Link, useParams } from "react-router-dom";

const ListDetails: React.FC = () => {
  const { listId } = useParams();
  return (
    <div className="grid gap-5">
      <div className="flex items-center gap-2">
        <Link
          to={`/list/${listId}`}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
        >
          <i className="fa-solid fa-arrow-left" />
        </Link>
        <h2 className="text-xl font-bold tracking-tight">Update List</h2>
      </div>
    </div>
  );
};

export default ListDetails;
