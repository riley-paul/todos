import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Card, Heading, TextField } from "@radix-ui/themes";
import FormFieldError from "@/components/ui/form-field-error";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { actions } from "astro:actions";
import { toast } from "sonner";
import { goToList } from "@/lib/links";

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
    <Card size="2" className="grid gap-4">
      <Heading as="h2" size="4" mb="2">
        Create list
      </Heading>
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-[auto_8rem]">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div className="grid gap-1">
              <TextField.Root autoFocus placeholder="Unnamed list" {...field} />
              <FormFieldError error={error} />
            </div>
          )}
        />
        <input type="submit" hidden />
        <Button type="submit" variant="soft">
          <i className="fa-solid fa-save" />
          Save
        </Button>
      </form>
    </Card>
  );
}
