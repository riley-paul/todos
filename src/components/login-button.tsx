import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@radix-ui/themes";

type AuthProvider = {
  name: string;
  url: string;
  icon: string;
  className?: string;
};

const authProviders: Record<string, AuthProvider> = {
  github: {
    name: "GitHub",
    url: "/login/github",
    icon: "fa-brands fa-github",
  },
  google: {
    name: "Google",
    url: "/login/google",
    icon: "fa-brands fa-google",
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
    <Button
      asChild
      className={cn("relative", authProvider.className, className)}
      variant="soft"
    >
      <a href={authProvider.url}>
        <span className="absolute left-4">
          <i className={cn(authProvider.icon)} />
        </span>
        <span>Continue with {authProvider.name}</span>
      </a>
    </Button>
  );
};

export default LoginButton;
