import type { ListSelect } from "@/lib/types";
import { Button, IconButton } from "@radix-ui/themes";
import { Share2Icon } from "lucide-react";
import React from "react";
import UserBubbleGroup from "../ui/user-bubble-group";
import { Link, linkOptions } from "@tanstack/react-router";
import useIsLinkActive from "@/app/hooks/use-is-link-active";

type Props = { list: ListSelect };

const ListSharingLink: React.FC<Props> = ({ list }) => {
  const link = linkOptions({
    to: "/todos/$listId/share",
    params: { listId: list.id },
  });

  const isActive = useIsLinkActive(link);

  if (list.otherUsers.length === 0) {
    return (
      <IconButton
        asChild
        variant={isActive ? "solid" : "ghost"}
        className="-mx-2 h-auto py-1 px-2"
      >
        <Link {...link}>
          <Share2Icon className="size-4" />
        </Link>
      </IconButton>
    );
  }
  return (
    <Button
      asChild
      variant={isActive ? "solid" : "ghost"}
      className="-mx-2 h-auto py-1 px-2"
    >
      <Link {...link}>
        <UserBubbleGroup users={list.otherUsers} numAvatars={3} />
      </Link>
    </Button>
  );
};

export default ListSharingLink;
