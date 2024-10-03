import useMutations from "@/hooks/use-mutations";
import type { ListSelect } from "@/lib/types";
import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useDeleteButton from "@/hooks/use-delete-button";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(3).max(50),
  shares: z.array(z.string().email()),
});

type Schema = z.infer<typeof schema>;

type Props = {
  list?: ListSelect;
  onSubmit?: () => void;
};

const ListForm: React.FC<Props> = (props) => {
  const { list, onSubmit } = props;
  const { updateList, createList, deleteList } = useMutations();

  const handlers = useForm<Schema>({
    values: {
      name: list?.name ?? "",
      shares: [],
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, control } = handlers;

  const {
    ref: deleteRef,
    isConfirming,
    handleClick,
  } = useDeleteButton({
    handleDelete: () => deleteList.mutate({ id: list?.id ?? "" }),
  });

  return (
    <Form {...handlers}>
      <form
        className="grid items-start gap-4"
        onSubmit={handleSubmit((data) => {
          if (list) {
            updateList.mutate({ id: list.id, data: { name: data.name } });
          } else {
            createList.mutate({ name: data.name });
          }
          onSubmit?.();
        })}
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="List name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={cn("grid gap-2", list && "grid-cols-2")}>
          {list && (
            <Button
              type="button"
              ref={deleteRef}
              variant={isConfirming ? "destructive" : "secondary"}
              onClick={handleClick}
            >
              <i className="fa-solid fa-trash mr-2" />
              <span>{isConfirming ? "Confirm?" : "Delete list"}</span>
            </Button>
          )}
          <Button type="submit" className="flex-1">
            <i className="fa-solid fa-save mr-2" />
            <span>Save changes</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ListForm;
