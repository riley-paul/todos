import React from "react";
import {
  Dialog,
  IconButton,
  Tooltip,
  type ButtonProps,
  type TooltipProps,
} from "@radix-ui/themes";
import { Link, useParams } from "@tanstack/react-router";
import { useIsMobile } from "@/hooks/use-is-mobile";
import ListEditorForm from "./list-editor-form";
import { goToListEditor } from "@/lib/links";

const BUTTON_PROPS: ButtonProps = {
  variant: "soft",
  size: "3",
  radius: "full",
};

const ButtonChild = () => <i className="fas fa-pen" />;

const TOOLTIP_PROPS: TooltipProps = {
  side: "top",
  content: "Edit List",
};

const ListEditor: React.FC = () => {
  const isMobile = useIsMobile();
  const { listId } = useParams({ strict: false });

  if (!listId || listId === "all") return null;

  if (isMobile) {
    return (
      <Tooltip {...TOOLTIP_PROPS}>
        <IconButton asChild {...BUTTON_PROPS}>
          <Link {...goToListEditor(listId)}>
            <ButtonChild />
          </Link>
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Dialog.Root>
      <Tooltip {...TOOLTIP_PROPS}>
        <Dialog.Trigger>
          <IconButton {...BUTTON_PROPS}>
            <ButtonChild />
          </IconButton>
        </Dialog.Trigger>
      </Tooltip>
      <Dialog.Content>
        <ListEditorForm />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ListEditor;
