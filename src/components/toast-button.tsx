import React from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const ToastButton: React.FC = () => {
  return (
    <Button onClick={() => toast.success("Hello again")}> Hello world </Button>
  );
};

export default ToastButton;
