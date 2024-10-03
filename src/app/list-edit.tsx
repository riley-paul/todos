import { Button, buttonVariants } from "@/components/ui/button";
import useDeleteButton from "@/hooks/use-delete-button";
import useMutations from "@/hooks/use-mutations";
import { cn } from "@/lib/utils";
import React from "react";
import { Link, useParams } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ListForm from "@/components/list-form";
import PageHeader from "@/components/page-header";

const ListEdit: React.FC = () => {
  const { listId } = useParams();

  const { deleteList } = useMutations();

  const {
    ref: deleteRef,
    isConfirming,
    handleClick,
  } = useDeleteButton({
    handleDelete: () => deleteList.mutate({ id: listId ?? "" }),
  });

  return (
    <div className="grid gap-5">
      <PageHeader title="Update list" backLink={`/list/${listId}`} />
      <Card>
        <CardHeader>
          <CardTitle>Info</CardTitle>
        </CardHeader>
        <CardContent>
          <ListForm />
        </CardContent>
      </Card>

      <Button
        type="button"
        ref={deleteRef}
        variant={isConfirming ? "destructive" : "secondary"}
        onClick={handleClick}
      >
        <i className="fa-solid fa-trash mr-2" />
        <span>{isConfirming ? "Confirm?" : "Delete list"}</span>
      </Button>
    </div>
  );
};

export default ListEdit;
