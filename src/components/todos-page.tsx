import React from "react";
import Lists from "./lists";
import TodoAdder from "./todo-adder";
import Todos from "./todos";
import type { SelectedList } from "@/lib/types";

const TodosPage: React.FC<{ listId: SelectedList }> = ({ listId }) => {
  return (
    <>
      <TodoAdder listId={listId} />
      <Lists />
      <Todos listId={listId} />
    </>
  );
};

export default TodosPage;
