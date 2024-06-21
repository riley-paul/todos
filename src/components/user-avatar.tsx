import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Laptop,
  LogOut,
  Moon,
  Sun,
  Trash,
  User as UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useThemeStore, type Theme } from "@/lib/theme/theme-store";
import type { User } from "astro:db";
import LoginButton from "./login-button";

interface DialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AccountDeletionConfirm: React.FC<DialogProps> = (props) => {
  const { isOpen, setIsOpen } = props;
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form method="POST" action="/api/auth/delete">
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface Props {
  user: typeof User.$inferSelect | null;
}

const UserAvatar: React.FC<Props> = ({ user }) => {
  const [accountDeletionOpen, setAccountDeletionOpen] = React.useState(false);
  const { theme, setTheme } = useThemeStore();

  if (!user) {
    return <LoginButton />;
  }

  return (
    <>
      <AccountDeletionConfirm
        isOpen={accountDeletionOpen}
        setIsOpen={setAccountDeletionOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src={user.avatarUrl ?? ""} />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-60">
          <div className="flex gap-4 p-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
              <AvatarFallback>
                <UserIcon size="3rem" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.username}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={(v) => setTheme(v as Theme)}
          >
            <DropdownMenuRadioItem value="light">
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setAccountDeletionOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete Account</span>
          </DropdownMenuItem>
          <a href="/api/auth/logout">
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </a>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserAvatar;
