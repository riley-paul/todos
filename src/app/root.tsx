import React from "react";
import Adder from "@/components/adder";
import TodoList from "@/components/todo-list";
import Lists from "@/components/lists";

const Root: React.FC = () => {
  return (
    <div className="grid w-full gap-6">
      <Adder />
      <Lists />
      <TodoList />
    </div>
  );
};

export default Root;
