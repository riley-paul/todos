import React from "react";
import Header from "./components/header";
import Adder from "./components/adder";
import HashtagList from "./components/hashtag-list";
import TodoList from "./components/todo-list";

const Root: React.FC = () => {
  return (
    <>
      <Header />
      <main className="container2">
        <div className="flex w-full flex-col gap-4 pb-28 pt-6">
          <Adder />
          <HashtagList />
          <TodoList />
        </div>
      </main>
    </>
  );
};

export default Root;
