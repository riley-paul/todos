import React from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ResponsiveModal from "@/components/responsive-modal";
import { useEventListener } from "usehooks-ts";

const ListEditor: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  useEventListener("keydown", (e) => {
    if (e.key === "e" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setOpen(true);
    }
  });

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <DialogHeader>
        <DialogTitle>Edit {}</DialogTitle>
        <DialogDescription>
          Add, remove, edit and share your lists
        </DialogDescription>
      </DialogHeader>
    </ResponsiveModal>
  );
};

export default ListEditor;
