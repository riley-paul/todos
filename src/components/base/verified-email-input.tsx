import { userByEmailQueryOptions } from "@/lib/queries";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useDebounceValue } from "usehooks-ts";

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
  setValue: (email: string) => void;
  setValid: (valid: boolean) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const VerifiedEmailInput = React.forwardRef<HTMLInputElement, Props>(
  ({ setValue, setValid, inputProps }, ref) => {
    const [email, setEmail] = useDebounceValue("", 500);

    const sharedUserQuery = useQuery({
      ...userByEmailQueryOptions(email),
      enabled: email.length > 0,
    });

    React.useEffect(() => {
      setValid(sharedUserQuery.status === "success" && sharedUserQuery.data);
    }, [sharedUserQuery.status, sharedUserQuery.data, setValid]);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
            setValue(e.target.value);
          }}
          className={cn("relative truncate pr-9", inputProps?.className)}
          {...inputProps}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {getIcon(sharedUserQuery)}
        </div>
      </div>
    );
  },
);

export default VerifiedEmailInput;
