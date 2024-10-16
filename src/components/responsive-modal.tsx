import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import React from "react";
import { useMediaQuery } from "usehooks-ts";
import { MOBILE_MEDIA_QUERY } from "@/lib/constants";

type Props = React.PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

const ResponsiveModal: React.FC<Props> = ({ open, onOpenChange, children }) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="hide-scrollbar grid max-h-[85vh] gap-4 overflow-y-auto px-4 py-6">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="hide-scrollbar max-h-[85vh] w-full overflow-y-auto border-none p-6 sm:max-w-lg">
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveModal;
