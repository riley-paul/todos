import React from "react";
import HashtagLink from "./hashtag-link";

type Props = {
  text: string;
};

const TodoText: React.FC<Props> = (props) => {
  const { text } = props;

  return text.split(" ").map((word, index) => {
    const isTag = word.startsWith("#");
    if (isTag) {
      return (
        <>
          <HashtagLink key={index} tag={word.slice(1)} string={word} />{" "}
        </>
      );
    }
    return <span key={index}>{word} </span>;
  });
};

export default TodoText;
