import { cn } from "@/app/lib/utils";
import React from "react";
import { buttonVariants } from "./ui/button";

import { FaGithub, FaGoogle } from "react-icons/fa6";

const authProviders: Record<
  string,
  { name: string; url: string; icon: React.ReactNode }
> = {
  github: {
    name: "GitHub",
    url: "/api/auth/login/github",
    icon: <FaGithub className="mr-2 h-5 w-5" />,
  },
  google: {
    name: "Google",
    url: "/api/auth/login/google",
    icon: <FaGoogle className="mr-2 h-5 w-5" />,
  },
};

type Props = {
  className?: string;
  provider: keyof typeof authProviders;
};

const LoginButton: React.FC<Props> = (props) => {
  const { className, provider } = props;
  const authProvider = authProviders[provider];
  return (
    <a
      className={cn(buttonVariants({ size: "lg" }), className)}
      href={authProvider.url}
    >
      {authProvider.icon}
      Login with {authProvider.name}
    </a>
  );
};

export default LoginButton;
