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

const schema = z.object({
  name: z.string().min(3).max(50),
});

type Schema = z.infer<typeof schema>;

type Props = {
  list?: ListSelect;
  onSubmit?: () => void;
};

const ListForm: React.FC<Props> = (props) => {
  const { list, onSubmit } = props;
  const isNew = !list;
  const { updateList, createList } = useMutations();

  const handlers = useForm<Schema>({
    values: {
      name: list?.name ?? "",
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, control } = handlers;

  return (
    <Form {...handlers}>
      <form
        className="grid items-start gap-4"
        onSubmit={handleSubmit((data) => {
          if (isNew) {
            createList.mutate({ name: data.name });
          } else {
            updateList.mutate({ id: list.id, data: { name: data.name } });
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

        <Button type="submit" className="flex-1">
          <i className="fa-solid fa-save mr-2" />
          <span>{isNew ? "Create list" : "Save changes"}</span>
        </Button>
      </form>
    </Form>
  );
};

export default ListForm;
