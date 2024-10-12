import { Save } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

type Props = {
  initialValue: string;
  handleSubmit: (value: string) => void;
  className?: string;
  buttonProps?: ButtonProps;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  clearAfterSubmit?: boolean;
};

const SingleInputForm: React.FC<Props> = ({
  initialValue,
  handleSubmit,
  className,
  buttonProps,
  inputProps,
  clearAfterSubmit,
}) => {
  const [value, setValue] = React.useState(initialValue);
  return (
    <form
      className={cn("flex gap-2 w-full items-center h-9", className)}
      onSubmit={(e) => {
        e.preventDefault();
        if (value.length === 0) {
          toast.error("Input cannot be empty");
          return;
        }
        handleSubmit(value);
        if (clearAfterSubmit) setValue("");
      }}
    >
      <Input
        className="h-full"
        autoFocus
        value={value}
        placeholder="Enter some text"
        onChange={(e) => setValue(e.target.value)}
        {...inputProps}
      />
      <Button
        type="submit"
        variant="secondary"
        disabled={value.length === 0}
        children={
          <>
            <Save className="size-4 mr-2" />
            <span>Save</span>
          </>
        }
        {...buttonProps}
        className={cn("h-full", buttonProps?.className)}
      />
      <input type="submit" className="hidden" />
    </form>
  );
};

export default SingleInputForm;
