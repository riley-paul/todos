import { useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Heading, TextField } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import { actions } from "astro:actions";
import { toast } from "sonner";
import { goToList } from "@/lib/links";
import FormFieldError from "./ui/form-field-error";

const schema = z.object({
  name: z.string().nonempty(),
});
type Schema = z.infer<typeof schema>;

const ListAdderForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  const create = useMutation({
    mutationFn: actions.lists.create.orThrow,
    onSuccess: ({ id }) => {
      navigate(goToList(id));
      onSuccess?.();
      toast.success("List created");
    },
  });

  const onSubmit = handleSubmit((data) => create.mutate(data));

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <Heading as="h2" size="4" mb="2">
        Create list
      </Heading>
      <div className="grid gap-2 sm:grid-cols-[auto_8rem]">
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
      </div>
    </form>
  );
};

export default ListAdderForm;
