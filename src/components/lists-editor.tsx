import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SingleInputForm from "./single-input-form";
import { Label } from "./ui/label";
import useMutations from "@/hooks/use-mutations";
import type { ListSelect } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions } from "@/lib/queries";
import QueryGuard from "./base/query-guard";
import UserBubbleGroup from "./base/user-bubble-group";
import { Button } from "./ui/button";
import { DoorOpen, Trash } from "lucide-react";
import useConfirmButton from "@/hooks/use-confirm-button";

const ListContent: React.FC<{ list: ListSelect }> = ({ list }) => {
  const { updateList, leaveListShare, deleteList } = useMutations();
  const { ref, buttonProps, isConfirming } = useConfirmButton({
    handleConfirm: () =>
      list.isAuthor
        ? deleteList.mutate({ id: list.id })
        : leaveListShare.mutate({ listId: list.id }),
  });
  return (
    <div className="grid gap-2">
      <SingleInputForm
        inputProps={{ placeholder: "Enter list name" }}
        initialValue={list.name}
        handleSubmit={(name) =>
          updateList.mutate({ id: list.id, data: { name } })
        }
      />
      <Button ref={ref} size="sm" {...buttonProps}>
        {isConfirming ? (
          "Are you sure?"
        ) : list.isAuthor ? (
          <>
            <Trash className="mr-2 size-4" />
            <span>Delete </span>
          </>
        ) : (
          <>
            <DoorOpen className="mr-2 size-4" />
            <span>Leave </span>
          </>
        )}
      </Button>
    </div>
  );
};

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const ListsEditor: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen } = props;
  const listsQuery = useQuery(listsQueryOptions);
  const { createList } = useMutations();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage your lists</DialogTitle>
          <DialogDescription>
            Add, remove, edit and share your lists
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[400px] min-h-[150px] overflow-scroll rounded-lg bg-secondary/20 px-3">
          <QueryGuard query={listsQuery}>
            {(lists) => (
              <Accordion type="single">
                {lists.map((list) => (
                  <AccordionItem value={list.id}>
                    <AccordionTrigger className="h-10">
                      <div className="flex items-center gap-2">
                        <span>{list.name}</span>
                        <UserBubbleGroup
                          users={list.otherUsers}
                          numAvatars={10}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="grid gap-2 p-1">
                      <ListContent list={list} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </QueryGuard>
        </div>
        <div className="grid gap-2">
          <Label>Add a List</Label>
          <SingleInputForm
            clearAfterSubmit
            initialValue=""
            inputProps={{ placeholder: "Enter list name" }}
            handleSubmit={(name) => createList.mutate({ name })}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ListsEditor;
