import { cn } from "@/lib/utils";
import React from "react";
import { Link } from "react-router-dom";
import { buttonVariants } from "./ui/button";

type Props = {
  title: string;
  backLink?: string;
};

const PageHeader: React.FC<Props> = (props) => {
  const { backLink, title } = props;

  return (
    <header className="flex items-center gap-1">
      {backLink && (
        <Link
          to={backLink}
          className={cn(
            buttonVariants({ variant: "ghostMuted", size: "icon" }),
            "rounded-full h-5 w-7 text-xs",
          )}
        >
          <i className="fa-solid fa-arrow-left" />
        </Link>
      )}
      <h2 className="text-sm font-bold uppercase tracking-tight text-muted-foreground">
        {title}
      </h2>
    </header>
  );
};

export default PageHeader;
