import { Loader2 } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { userByEmailQueryOptions } from "@/lib/queries";
import { z } from "zod";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useMutations from "@/hooks/use-mutations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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

const SharedTagCreator: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [tag, setTag] = React.useState("");

  const sharedUserQuery = useQuery({
    ...userByEmailQueryOptions(email),
    enabled: z.string().email().safeParse(email).success,
  });

  const { createSharedTag } = useMutations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span>Share a Tag</span>
        </CardTitle>
        <CardDescription>
          Share todos with others by creating a shared tag
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            createSharedTag.mutate({ tag, email });

            setEmail("");
            setTag("");
          }}
        >
          <div className="grid grid-cols-[2fr_3fr] gap-2">
            <Input
              type="text"
              placeholder="Tag name"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
            <div className="relative">
              <Input
                type="email"
                placeholder="Who to share with?"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {getIcon(sharedUserQuery)}
              </div>
            </div>
          </div>
          <Button
            type="submit"
            disabled={!sharedUserQuery.data || createSharedTag.isPending}
            size="sm"
            variant="secondary"
          >
            <i className="fa-solid fa-paper-plane mr-2" />
            <span>Share</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SharedTagCreator;
