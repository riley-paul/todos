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
        <React.Fragment key={index}>
          <HashtagLink tag={word.slice(1)} string={word} />{" "}
        </React.Fragment>
      );
    }
    return <span key={index}>{word} </span>;
  });
};

export default TodoText;
