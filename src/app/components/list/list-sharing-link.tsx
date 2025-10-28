import type { ListSelect } from "@/lib/types";
import { Button, IconButton } from "@radix-ui/themes";
import { Share2Icon } from "lucide-react";
import React from "react";
import UserBubbleGroup from "../ui/user-bubble-group";
import { Link, linkOptions } from "@tanstack/react-router";
import useIsLinkActive from "@/app/hooks/use-is-link-active";
import type { BaseButtonProps } from "@radix-ui/themes/components/_internal/base-button";
import { cn } from "@/app/lib/utils";

type Props = { list: ListSelect };

const ListSharingLink: React.FC<Props> = ({ list }) => {
  const link = linkOptions({
    to: "/todos/$listId/share",
    params: { listId: list.id },
  });

  const isActive = useIsLinkActive(link);

  const buttonProps: BaseButtonProps = {
    asChild: true,
    variant: "ghost",
    className: cn(isActive && "bg-accent-4"),
  };

  if (list.otherUsers.length === 0) {
    return (
      <IconButton {...buttonProps}>
        <Link {...link}>
          <Share2Icon className="size-4" />
        </Link>
      </IconButton>
    );
  }
  return (
    <Button {...buttonProps}>
      <Link {...link}>
        <UserBubbleGroup users={list.otherUsers} numAvatars={3} />
      </Link>
    </Button>
  );
};

export default ListSharingLink;
