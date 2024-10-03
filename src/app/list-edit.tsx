import { Button, buttonVariants } from "@/components/ui/button";
import useDeleteButton from "@/hooks/use-delete-button";
import useMutations from "@/hooks/use-mutations";
import React from "react";
import { Link, useParams } from "react-router-dom";

import PageHeader from "@/components/page-header";
import ServerInput from "@/components/server-input";

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
    <div className="grid gap-4 px-3">
      <PageHeader title="Update list" />

      <ServerInput currentValue="List name" onUpdate={() => {}} />

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          ref={deleteRef}
          variant={isConfirming ? "destructive" : "secondary"}
          onClick={handleClick}
        >
          {isConfirming && <i className="fa-solid fa-trash mr-2" />}
          <span>{isConfirming ? "Confirm?" : "Delete list"}</span>
        </Button>
        <Link to={`/list/${listId}`} className={buttonVariants()}>
          <i className="fa-solid fa-check mr-2" />
          <span>Done</span>
        </Link>
      </div>
    </div>
  );
};

export default ListEdit;
