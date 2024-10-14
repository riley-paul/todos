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
import { useDebounceValue, useMediaQuery } from "usehooks-ts";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { userByEmailQueryOptions } from "@/lib/queries";
import { MOBILE_MEDIA_QUERY } from "@/lib/constants";

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

type Size = "sm" | "default";

type Props = {
  initialValue: string;
  handleSubmit: (value: string) => void;

  button?: Partial<{
    icon: React.ReactNode;
    string: string;
    variant: ButtonProps["variant"];
  }>;

  placeholder?: string;

  size?: Size;

  clearAfterSubmit?: boolean;
  isUserEmail?: boolean;
};

const sizeClassnames: Record<Size, string> = {
  default: "h-9",
  sm: "h-8 text-sm",
} as const;

const SingleInputForm: React.FC<Props> = ({
  initialValue,
  handleSubmit,

  button = {
    icon: <Save className="size-4" />,
    string: "Save",
    variant: "secondary",
  },
  size = "default",

  placeholder = "Enter some text",

  clearAfterSubmit,
  isUserEmail,
}) => {
  const [value, setValue] = React.useState(initialValue);
  const [email, setEmail] = useDebounceValue("", 500);

  const sharedUserQuery = useQuery({
    ...userByEmailQueryOptions(email),
    enabled: email.length > 0 && isUserEmail,
  });

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  return (
    <form
      className={cn(
        "grid w-full grid-cols-[1fr_auto] items-center gap-2",
        sizeClassnames[size],
      )}
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
      <div className="relative h-full">
        <Input
          className={cn(
            "truncate",
            isUserEmail && "pr-9",
            sizeClassnames[size],
          )}
          autoFocus
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            setValue(e.target.value);
            setEmail(e.target.value);
          }}
          type={isUserEmail ? "email" : "text"}
        />
        {isUserEmail && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {getIcon(sharedUserQuery)}
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant={button.variant}
        disabled={value.length === 0 || (isUserEmail && !sharedUserQuery.data)}
        children={
          <>
            {button.icon}
            {!isMobile && <span className="ml-2">{button.string}</span>}
          </>
        }
        size={isMobile ? "icon" : size}
        className={cn(size === "sm" && "h-8")}
      />
      <input type="submit" className="hidden" />
    </form>
  );
};

export default SingleInputForm;
