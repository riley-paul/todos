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
import useConfirmButton from "@/hooks/use-confirm-button";
import UserBubble from "./base/user-bubble";
import DeleteButton from "./ui/delete-button";

const ListContent: React.FC<{ list: ListSelect }> = ({ list }) => {
  const {
    updateList,
    leaveListShare,
    deleteListShare,
    deleteList,
    createListShare,
  } = useMutations();

  const { ref, buttonProps, isConfirming } = useConfirmButton({
    handleConfirm: () =>
      list.isAuthor
        ? deleteList.mutate({ id: list.id })
        : leaveListShare.mutate({ listId: list.id }),
  });

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label className="text-xs">Update name</Label>
        <SingleInputForm
          placeholder="Enter list name"
          initialValue={list.name}
          handleSubmit={(name) =>
            updateList.mutate({ id: list.id, data: { name } })
          }
        />
      </div>
      {list.isAuthor && (
        <div className="grid gap-2">
          <Label className="text-xs">Share with</Label>
          <div className="max-h-48 min-h-12 overflow-scroll rounded bg-secondary/20 px-2">
            <div className="grid divide-y">
              {list.shares.map((share) => (
                <div className="flex items-center gap-2 py-2">
                  <UserBubble user={share.user} />
                  <div className="grid flex-1 gap-0.5">
                    <span>{share.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {share.user.email}
                    </span>
                  </div>
                  {share.isPending && (
                    <i className="fa-solid fa-hourglass text-muted-foreground" />
                  )}
                  <DeleteButton
                    handleDelete={() =>
                      deleteListShare.mutate({ id: share.id })
                    }
                  />
                </div>
              ))}
              {list.shares.length === 0 && (
                <div className="flex h-12 items-center justify-center text-xs text-muted-foreground">
                  No shares
                </div>
              )}
            </div>
          </div>
          <SingleInputForm
            size="sm"
            placeholder="Enter email"
            button={{
              icon: <i className="fa-solid fa-paper-plane" />,
              string: "Invite",
              variant: "outline",
            }}
            initialValue=""
            handleSubmit={(email) =>
              createListShare.mutate({ listId: list.id, email })
            }
            isUserEmail
            clearAfterSubmit
          />
        </div>
      )}

      <Button ref={ref} size="sm" {...buttonProps}>
        {isConfirming ? (
          "Are you sure?"
        ) : list.isAuthor ? (
          <>
            <i className="fa-solid fa-trash mr-2" />
            <span>Delete list</span>
          </>
        ) : (
          <>
            <i className="fa-solid fa-door-open mr-2" />
            <span>Leave list</span>
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

  const [value, setValue] = React.useState("");

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
              <Accordion type="single" value={value} onValueChange={setValue}>
                {lists.map((list) => (
                  <AccordionItem value={list.id} className="">
                    <AccordionTrigger className="h-10">
                      <div className="flex items-center gap-2">
                        <span>{list.name}</span>
                        <UserBubbleGroup
                          users={list.otherUsers}
                          numAvatars={10}
                        />
                        {list.isAuthor && (
                          <i className="fa-solid fa-star text-primary" />
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-1 pt-2 data-[state=open]:bg-red-500">
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
            placeholder="Enter list name"
            button={{
              icon: <i className="fa-solid fa-plus" />,
              string: "Add list",
              variant: "default",
            }}
            handleSubmit={(name) => {
              createList.mutate({ name });
              setValue("");
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ListsEditor;
