import React from "react";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ResponsiveModal from "@/components/responsive-modal";
import { useEventListener } from "usehooks-ts";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import type { ListSelect } from "@/lib/types";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useMutations from "@/hooks/use-mutations";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  name: z.string().min(1),
  shares: z.string().email().array(),
});

type Schema = z.infer<typeof schema>;

const ListModal: React.FC<{
  list: ListSelect | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen, list }) => {
  const { createList } = useMutations();

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      shares: [],
    },
  });

  const {} = useFieldArray<Schema>({
    control: form.control,
    name: "shares",
  });

  const onSubmit = form.handleSubmit((data) => console.log(data));

  useEventListener("keydown", (e) => {
    if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setOpen(true);
    }
  });

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <DialogHeader>
        <DialogTitle>{list ? `Edit ${list.name}` : "Add a List"}</DialogTitle>
        <DialogDescription>
          {list
            ? "Update name, and share and unshare"
            : "Specify a name and any users to share with"}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter list name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-2">
            <Label>Share with</Label>
            <Input placeholder="Enter email" />
            <div className="flex min-h-12 items-center justify-center rounded bg-muted/20 text-sm text-muted-foreground">
              No shares yet
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              <i className="fa-solid fa-save mr-2" />
              <span>Save</span>
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </ResponsiveModal>
  );
};

export default ListModal;
