import { cn } from "@/app/lib/utils";
import React from "react";
import { buttonVariants } from "./ui/button";
import { FaGithub } from "react-icons/fa6";

type Props = {
  className?: string;
};

const LoginButton: React.FC<Props> = (props) => {
  const { className } = props;
  return (
    <a
      className={cn(buttonVariants(), className)}
      href="/api/auth/login/github"
    >
      <FaGithub className="mr-2 h-5 w-5" />
      Login with GitHub
    </a>
  );
};

export default LoginButton;
