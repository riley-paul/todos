import type { UserSelect } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useMediaQuery } from "usehooks-ts";
import { MOBILE_MEDIA_QUERY } from "@/lib/constants";

const OtherUserAvatar: React.FC<{ user: UserSelect }> = ({ user }) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  return (
    <HoverCard>
      <HoverCardTrigger>
        <span className="flex h-full items-center justify-end gap-2 text-xs text-muted-foreground">
          {!isMobile && user.name}
          <Avatar className="size-6">
            <AvatarImage src={user.avatarUrl ?? ""} />
            <AvatarFallback>
              {user.name.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="flex gap-3">
        <Avatar className="size-10">
          <AvatarImage src={user.avatarUrl ?? ""} />
          <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="grid">
          <span className="font-semibold">{user.name}</span>
          <span className="text-muted-foreground">{user.email}</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default OtherUserAvatar;
