import { Button, buttonVariants } from "@/components/ui/button";
import useDeleteButton from "@/hooks/use-delete-button";
import useMutations from "@/hooks/use-mutations";
import React from "react";
import { Link, useParams } from "react-router-dom";

import PageHeader from "@/components/page-header";
import ServerInput from "@/components/server-input";
import { useQuery } from "@tanstack/react-query";
import { listQueryOptions } from "@/lib/queries";
import QueryGuard from "@/components/query-guard";

const ListEdit: React.FC = () => {
  const { listId = "" } = useParams();

  const { deleteList, updateList } = useMutations();

  const listQuery = useQuery(listQueryOptions(listId));

  const {
    ref: deleteRef,
    isConfirming,
    handleClick,
  } = useDeleteButton({
    handleDelete: () => deleteList.mutate({ id: listId ?? "" }),
  });

  return (
    <QueryGuard queries={[listQuery]}>
      {([list]) => (
        <div className="grid gap-4 px-3">
          <PageHeader title={`Update ${list.name}`} />

          <ServerInput
            placeholder="List name..."
            currentValue={list.name}
            onUpdate={(name) =>
              updateList.mutate({ id: listId, data: { name } })
            }
          />

          <div>
            {list.shares.map((share) => (
              <div>{share.id}</div>
            ))}
          </div>

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
      )}
    </QueryGuard>
  );
};

export default ListEdit;
