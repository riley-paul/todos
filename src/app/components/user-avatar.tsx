import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
} from "@/app/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/app/lib/queries";
import { LogIn, LogOut, Trash, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";

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

const UserAvatar: React.FC = () => {
  const [accountDeletionOpen, setAccountDeletionOpen] = React.useState(false);

  const userQuery = useQuery(userQueryOptions);

  if (userQuery.isLoading) {
    return null;
  }

  if (userQuery.isError) {
    return <div>Error loading user</div>;
  }

  const user = userQuery.data;

  if (!user) {
    return (
      <Link
        to="/welcome"
        className={cn(buttonVariants({ variant: "secondary" }))}
      >
        <LogIn size="1rem" className="mr-2" />
        Login
      </Link>
    );
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
              <User size="1rem" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-60">
          <div className="flex gap-4 p-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
              <AvatarFallback>
                <User size="3rem" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setAccountDeletionOpen(true)}>
            <Trash size="1rem" className="mr-2" />
            <span>Delete Account</span>
          </DropdownMenuItem>
          <a href="/logout">
            <DropdownMenuItem>
              <LogOut size="1rem" className="mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </a>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserAvatar;
