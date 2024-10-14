import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import LoginButton from "./login-button";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/queries";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import useMutations from "@/hooks/use-mutations";

interface DialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AccountDeletionConfirm: React.FC<DialogProps> = (props) => {
  const { isOpen, setIsOpen } = props;
  const { deleteUser } = useMutations();
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
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction type="submit" asChild>
            <Button variant="destructive" onClick={() => deleteUser.mutate({})}>
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
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
      <span className="flex gap-1">
        <LoginButton provider="github" />
        <LoginButton provider="google" />
      </span>
    );
  }

  return (
    <>
      <AccountDeletionConfirm
        isOpen={accountDeletionOpen}
        setIsOpen={setAccountDeletionOpen}
      />
      <Popover>
        <PopoverTrigger asChild title="User settings">
          <Avatar>
            <AvatarImage src={user.avatarUrl ?? ""} />
            <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent align="end" className="grid w-auto min-w-52 gap-4">
          <div className="flex max-w-min gap-4">
            <Avatar className="size-16 text-[3rem]">
              <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
              <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid w-full gap-2">
            <a
              href="/logout"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "relative",
              )}
            >
              <i className="fa-solid fa-sign-out absolute left-4 mr-2" />
              <span>Logout</span>
            </a>
            <Button
              variant="destructive"
              onClick={() => setAccountDeletionOpen(true)}
              className="relative"
            >
              <i className="fa-solid fa-trash absolute left-4 mr-2" />
              <span>Delete Account</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default UserAvatar;
