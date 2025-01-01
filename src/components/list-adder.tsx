import React from "react";
import { Drawer } from "vaul";
import VaulDrawer from "./vaul-drawer";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const ListAdder: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  return (
    <VaulDrawer isOpen={isOpen} setIsOpen={setIsOpen}>
      <Drawer.Title>Hello</Drawer.Title>
      <Drawer.Description>This is a nice drawer</Drawer.Description>
    </VaulDrawer>
  );
};

export default ListAdder;
