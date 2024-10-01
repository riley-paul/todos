import ConditionalValueEditor from "@/components/conditional-value-editor";
import { buttonVariants } from "@/components/ui/button";
import useMutations from "@/hooks/use-mutations";
import { listQueryOptions } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";

const EditList: React.FC = () => {
  const { listId } = useParams();
  const listQuery = useQuery(listQueryOptions(listId ?? ""));

  const {} = useMutations();

  if (listQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (listQuery.isError) {
    return <div>Error loading list</div>;
  }

  if (!listQuery.data) {
    return <div>List not found</div>;
  }

  const list = listQuery.data;

  return (
    <div className="grid gap-4">
      <Link
        to={`/list/${listId}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "w-fit px-3",
        )}
      >
        <i className="fa-solid fa-arrow-left mr-2" />
        <span>Back</span>
      </Link>

      <div className="flex items-end gap-6 px-3">
        <div className="flex size-20 items-center justify-center rounded-md bg-muted text-muted-foreground shadow">
          <i className="fa-solid fa-list text-4xl" />
        </div>
        <div className="grid gap-1">
          <span className="text-sm text-muted-foreground">List</span>
          <ConditionalValueEditor
            initialValue={list.name}
            saveValue={() => {}}
            displayClassName="text-2xl font-bold"
            placeholder="List name"
          />
        </div>
      </div>
    </div>
  );
};

export default EditList;
