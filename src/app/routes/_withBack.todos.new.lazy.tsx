import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Heading, TextField } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import { actions } from "astro:actions";

const schema = z.object({
  name: z.string().nonempty(),
});
type Schema = z.infer<typeof schema>;

export const Route = createLazyFileRoute("/_withBack/todos/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  const create = useMutation({
    mutationFn: actions.createList.orThrow,
    onSuccess: ({ id }) =>
      navigate({ to: "/todos/$listId", params: { listId: id } }),
  });

  const onSubmit = handleSubmit((data) => {
    create.mutate(data);
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <Heading as="h2" size="4" mb="2">
        Create list
      </Heading>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField.Root autoFocus placeholder="Unnamed list" {...field} />
        )}
      />
      <input type="submit" hidden />
      <Button type="submit" variant="soft">
        <i className="fa-solid fa-save" />
        Save
      </Button>
    </form>
  );
}
