import type { ButtonProps } from "@radix-ui/themes";
import type { ZodType } from "astro/zod";

export type DeleteAlertProps = {
  type: "delete";
  title: string;
  message: string;
  handleDelete: () => void;
  confirmButtonProps?: ButtonProps;
};

export type ErrorAlertProps = {
  type: "error";
  title: string;
  message: string;
};

export type InputAlertProps = {
  type: "input";
  title: string;
  message: string;
  value?: string;
  placeholder?: string;
  schema?: ZodType<string, string>;
  handleSubmit: (value: string) => void;
};

export type AlertProps = DeleteAlertProps | ErrorAlertProps | InputAlertProps;
