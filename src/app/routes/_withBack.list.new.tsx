import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button, Heading, Text, TextField } from "@radix-ui/themes";
import FormFieldError from "@/components/ui/form-field-error";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { actions } from "astro:actions";
import { toast } from "sonner";
import { goToList } from "@/lib/client/links";

const schema = z.object({
  name: z.string().nonempty(),
});
type Schema = z.infer<typeof schema>;

export const Route = createFileRoute("/_withBack/list/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  const create = useMutation({
    mutationFn: actions.lists.create.orThrow,
    onSuccess: ({ id }) => {
      navigate(goToList(id));
      toast.success("List created");
    },
  });

  const onSubmit = handleSubmit((data) => create.mutate(data));

  return (
    <div className="grid gap-4">
      <header>
        <Heading as="h2" size="4">
          Create list
        </Heading>
        <Text size="2" color="gray">
          Enter a name for your new list
        </Text>
      </header>
      <form onSubmit={onSubmit} className="grid gap-3">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div className="grid gap-1">
              <TextField.Root
                autoFocus
                size="3"
                placeholder="Unnamed list"
                {...field}
              />
              <FormFieldError error={error} />
            </div>
          )}
        />
        <input type="submit" hidden />
        <div className="grid w-full grid-cols-2 gap-2 sm:ml-auto sm:max-w-56">
          <Button variant="soft" asChild>
            <Link to="/">
              <i className="fa-solid fa-xmark" />
              Cancel
            </Link>
          </Button>
          <Button type="submit">
            <i className="fa-solid fa-save" />
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
