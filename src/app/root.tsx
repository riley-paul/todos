import React from "react";
import Adder from "@/components/adder";
import Todos from "@/components/todos";
import Lists from "@/components/lists";

const Root: React.FC = () => {
  return (
    <div className="grid w-full gap-6">
      <Adder />
      <Lists />
      <Todos />
    </div>
  );
};

export default Root;
