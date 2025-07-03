import type { ListSelect } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Callout,
  Dialog,
  Strong,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import { actions } from "astro:actions";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod/v4";
import ListShares from "./list-shares";
import UserBubble from "../ui/user-bubble";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  list: ListSelect;
};

const inviteFormSchema = z.object({
  email: z
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
    <form
      onSubmit={onSubmit}
      className="grid w-full gap-2 sm:grid-cols-[1fr_8rem]"
    >
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
    </form>
  );
};

const ListShareDialog: React.FC<Props> = ({ list, isOpen, onOpenChange }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content className="grid gap-6">
        <header>
          <Dialog.Title size="3">Share List</Dialog.Title>
          <Dialog.Description size="2" color="gray">
            Add other users to your list so they can add and delete todos
          </Dialog.Description>
        </header>

        <Callout.Root variant="soft" size="1">
          <Callout.Icon>
            <UserBubble user={list.author} size="md" />
          </Callout.Icon>
          <Callout.Text>
            Created by <Strong>{list.author.name}</Strong>
          </Callout.Text>
        </Callout.Root>

        <section className="grid gap-4">
          <InviteForm list={list} />
          <ListShares list={list} />
        </section>
        <footer className="text-right">
          <Dialog.Close>
            <Button variant="soft">Close</Button>
          </Dialog.Close>
        </footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ListShareDialog;
