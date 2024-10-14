import { Loader2, Save } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebounceValue } from "usehooks-ts";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { userByEmailQueryOptions } from "@/lib/queries";

const getIcon = (query: UseQueryResult<boolean, Error>): React.ReactNode => {
  if (query.isLoading) {
    return <Loader2 className="size-4 animate-spin" />;
  }
  if (query.status === "success" && query.data) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <i className="fa-solid fa-circle-check text-green-500" />
        </TooltipTrigger>
        <TooltipContent side="right">User exists</TooltipContent>
      </Tooltip>
    );
  }
  if (query.status === "error" || query.data === false) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <i className="fa-solid fa-circle-xmark text-red-500" />
        </TooltipTrigger>
        <TooltipContent side="right">User does not exist</TooltipContent>
      </Tooltip>
    );
  }
  return null;
};

type Props = {
  initialValue: string;
  handleSubmit: (value: string) => void;
  className?: string;
  buttonProps?: ButtonProps;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  clearAfterSubmit?: boolean;
  isUserEmail?: boolean;
};

const SingleInputForm: React.FC<Props> = ({
  initialValue,
  handleSubmit,
  className,
  buttonProps,
  inputProps,
  clearAfterSubmit,
  isUserEmail,
}) => {
  const [value, setValue] = React.useState(initialValue);
  const [email, setEmail] = useDebounceValue("", 500);

  const sharedUserQuery = useQuery({
    ...userByEmailQueryOptions(email),
    enabled: email.length > 0 && isUserEmail,
  });

  return (
    <form
      className={cn("flex h-9 w-full items-center gap-2", className)}
      onSubmit={(e) => {
        e.preventDefault();
        if (value.length === 0) {
          toast.error("Input cannot be empty");
          return;
        }
        handleSubmit(value);
        if (clearAfterSubmit) {
          setValue("");
          setEmail("");
        }
      }}
    >
      <div className="relative h-full flex-1">
        <Input
          className={cn(
            "h-full truncate",
            isUserEmail && "pr-9",
            inputProps?.className,
          )}
          autoFocus
          value={value}
          placeholder="Enter some text"
          onChange={(e) => {
            setValue(e.target.value);
            setEmail(e.target.value);
          }}
          type={isUserEmail ? "email" : "text"}
          {...inputProps}
        />
        {isUserEmail && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {getIcon(sharedUserQuery)}
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant="secondary"
        disabled={value.length === 0 || (isUserEmail && !sharedUserQuery.data)}
        children={
          <>
            <Save className="mr-2 size-4" />
            <span>Save</span>
          </>
        }
        {...buttonProps}
        className={cn("h-full shrink-0", buttonProps?.className)}
      />
      <input type="submit" className="hidden" />
    </form>
  );
};

export default SingleInputForm;
