import React from "react";
import type { InputAlertProps } from "./alert-system.types";
import { Dialog, Button, Text, TextField } from "@radix-ui/themes";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";

type Schema = { value: string };

const AlertSystemContentInput: React.FC<InputAlertProps> = ({
  title,
  message,
  value = "",
  placeholder,
  schema = z.string().min(1, "This field is required"),
  handleSubmit,
}) => {
  const form = useForm<Schema>({
    defaultValues: { value },
    resolver: zodResolver(z.object({ value: schema })),
  });

  const onSubmit = form.handleSubmit(({ value }) => handleSubmit(value));

  return (
    <>
      <form onSubmit={onSubmit}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{message}</Dialog.Description>
        <Controller
          name="value"
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <div className="mt-6">
              <TextField.Root
                {...field}
                size="3"
                placeholder={placeholder}
                color={error ? "red" : undefined}
              />
              {error && (
                <Text color="red" size="1" className="mt-1">
                  {error.message}
                </Text>
              )}
            </div>
          )}
        />
        <footer className="mt-4 flex justify-end gap-3">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button type="submit">Submit</Button>
        </footer>
      </form>
    </>
  );
};

export default AlertSystemContentInput;
