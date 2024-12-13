import React from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDebounceValue, useMediaQuery } from "usehooks-ts";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { userByEmailQueryOptions } from "@/lib/queries";
import { MOBILE_MEDIA_QUERY } from "@/lib/constants";
import { Button, Flex, Grid, TextField, Tooltip } from "@radix-ui/themes";

const getIcon = (query: UseQueryResult<boolean, Error>): React.ReactNode => {
  if (query.isLoading) {
    return <i className="fa-solid fa-circle-nodes animate-spin" />;
  }
  if (query.status === "success" && query.data) {
    return (
      <Tooltip side="right" content="User exists">
        <i className="fa-solid fa-circle-check text-green-500" />
      </Tooltip>
    );
  }
  if (query.status === "error" || query.data === false) {
    return (
      <Tooltip side="right" content="User does not exist">
        <i className="fa-solid fa-circle-xmark text-red-500" />
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
  autoFocus?: boolean;

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
    icon: <i className="fa-solid fa-save" />,
    string: "Save",
    variant: "secondary",
  },
  size = "default",

  placeholder = "Enter some text",
  autoFocus,

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
      <Flex>
        <Flex>
          <TextField.Root
            autoFocus={autoFocus}
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
        </Flex>

        <Button
          type="submit"
          variant={button.variant}
          disabled={
            value.length === 0 || (isUserEmail && !sharedUserQuery.data)
          }
          children={
            <>
              {button.icon}
              {!isMobile && <span>{button.string}</span>}
            </>
          }
          className={cn(size === "sm" && "h-8")}
        />
        <input type="submit" hidden />
      </Flex>
    </form>
  );
};

export default SingleInputForm;
