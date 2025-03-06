import { listsQueryOptions } from "@/lib/queries";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React from "react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import UserBubble from "@/components/ui/user-bubble";
import {
  Button,
  Callout,
  Heading,
  Strong,
  Text,
  TextField,
} from "@radix-ui/themes";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { useParams } from "@tanstack/react-router";
import type { ListSelect } from "@/lib/types";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actions } from "astro:actions";
import { toast } from "sonner";
import ListShares from "@/components/list-shares";

const renameFormSchema = z.object({ name: z.string().nonempty() });
type RenameFormSchema = z.infer<typeof renameFormSchema>;
const RenameForm: React.FC<{ list: ListSelect }> = ({ list }) => {
  const { control, handleSubmit } = useForm<RenameFormSchema>({
    resolver: zodResolver(renameFormSchema),
    defaultValues: { name: list.name },
  });

  const rename = useMutation({
    mutationFn: actions.lists.update.orThrow,
    onSuccess: () => {
      toast.success("List renamed");
    },
  });

  const onSubmit = handleSubmit((data) => rename.mutate({ id: list.id, data }));

  return (
    <form onSubmit={onSubmit} className="grid gap-2">
      <Text as="label" size="2" weight="bold">
        Update Name
      </Text>
      <div className="grid w-full gap-2 sm:grid-cols-[1fr_8rem]">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState: { error } }) => (
            <div className="grid gap-1">
              <TextField.Root placeholder="New List" {...field} />
              {error && (
                <Text size="1" color="red" ml="1">
                  {error.message}
                </Text>
              )}
            </div>
          )}
        />
        <input type="submit" hidden />
        <Button type="submit">
          <i className="fa-solid fa-save" />
          Update
        </Button>
      </div>
    </form>
  );
};

const inviteFormSchema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => actions.users.checkIfEmailExists.orThrow({ email }), {
      message: "User not found",
    }),
});
type inviteFormSchema = z.infer<typeof inviteFormSchema>;
const InviteForm: React.FC<{ list: ListSelect }> = ({ list }) => {
  const { control, handleSubmit } = useForm<inviteFormSchema>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: { email: "" },
  });

  const invite = useMutation({
    mutationFn: actions.listShares.create.orThrow,
    onSuccess: () => {
      toast.success("Invitation sent");
    },
  });

  const onSubmit = handleSubmit(
    (data) => {
      invite.mutate({ listId: list.id, email: data.email });
    },
    (errors) => {
      console.error(errors);
      toast.error("Failed to send invitation");
    },
  );

  return (
    <form onSubmit={onSubmit} className="grid gap-2">
      <Text as="label" size="2" weight="bold">
        Share with
      </Text>

      <div className="grid w-full gap-2 sm:grid-cols-[1fr_8rem]">
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <div className="grid gap-1">
              <TextField.Root placeholder="user@gmail.com" {...field} />
              {error && (
                <Text size="1" color="red" ml="1">
                  {error.message}
                </Text>
              )}
            </div>
          )}
        />
        <input type="submit" hidden />
        <Button type="submit">
          <i className="fa-solid fa-paper-plane" />
          Invite
        </Button>
      </div>
    </form>
  );
};

export const Route = createFileRoute("/_withBack/list/$listId/edit")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(listsQueryOptions);
  },
});

function RouteComponent() {
  const navigate = useNavigate();

  const [DeleteDialog, confirmDelete] = useConfirmDialog({
    title: "Delete List",
    description:
      "This action is irreversible and will permanently delete this list and all of its contents for all users.",
  });

  const [LeaveDialog, confirmLeave] = useConfirmDialog({
    title: "Leave List",
    description:
      "This action will remove you from this list and you will no longer be able to view or edit it.",
  });

  const deleteList = useMutation({
    mutationFn: actions.lists.remove.orThrow,
    onSuccess: () => {
      navigate({ to: "/" });
      toast.success("List deleted");
    },
  });

  const leaveListShare = useMutation({
    mutationFn: actions.listShares.leave.orThrow,
    onSuccess: () => {
      navigate({ to: "/" });
      toast.success("You no longer have access to this list");
    },
  });

  const { listId } = useParams({ strict: false });
  const { data: lists } = useSuspenseQuery(listsQueryOptions);
  const list = lists.find((list) => list.id === listId);

  if (!list) return null;

  return (
    <>
      <div className="grid gap-4">
        <header>
          <Heading as="h2" size="4">
            Edit "{list.name}"
          </Heading>
          <Text size="2" color="gray">
            Edit, share, or delete this list
          </Text>
        </header>
        <Callout.Root variant="soft">
          <Callout.Icon>
            <UserBubble user={list.author} size="md" />
          </Callout.Icon>
          <Callout.Text>
            Created by <Strong>{list.author.name}</Strong>
          </Callout.Text>
        </Callout.Root>
        <RenameForm list={list} />
        <InviteForm list={list} />
        <ListShares list={list} />
        <div className="grid w-full grid-cols-2 gap-2 sm:ml-auto sm:max-w-72">
          <Button variant="soft" asChild>
            <Link to="/">
              <i className="fa-solid fa-xmark" />
              Cancel
            </Link>
          </Button>
          {list.isAuthor ? (
            <Button
              color="red"
              onClick={async () => {
                const ok = await confirmDelete();
                if (ok) deleteList.mutate({ id: list.id });
              }}
            >
              <i className="fa-solid fa-trash" />
              Delete List
            </Button>
          ) : (
            <Button
              color="amber"
              onClick={async () => {
                const ok = await confirmLeave();
                if (ok) leaveListShare.mutate({ listId: list.id });
              }}
            >
              <i className="fa-solid fa-arrow-right-from-bracket" />
              Leave List
            </Button>
          )}
        </div>
      </div>
      <DeleteDialog />
      <LeaveDialog />
    </>
  );
}
