import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listQueryOptions } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";

const EditList: React.FC = () => {
  const { listId } = useParams();
  const listQuery = useQuery(listQueryOptions(listId ?? ""));

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
          <h2 className="text-3xl font-bold">{list.name}</h2>
        </div>
      </div>

      <form className="grid gap-6 px-3 pt-8">
        <div className="grid gap-2">
          <Label>Name</Label>
          <Input placeholder="What should your list be called?" />
        </div>
        <div className="grid gap-4">
          <Label>Shared with</Label>
          list od shares
        </div>
      </form>
    </div>
  );
};

export default EditList;
