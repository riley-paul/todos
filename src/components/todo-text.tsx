import useSelectedTag from "@/hooks/use-selected-tag";
import React from "react";

type Props = {
  text: string;
};

const TodoText: React.FC<Props> = (props) => {
  const { text } = props;
  const { toggleTag } = useSelectedTag();

  return text.split(" ").map((word, index) => {
    const isTag = word.startsWith("#");
    if (isTag) {
      return (
        <>
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              toggleTag(word.slice(1));
            }}
          >
            <span className="text-primary transition-all hover:underline">
              {word}
            </span>
          </button>{" "}
        </>
      );
    }
    return <span key={index}>{word} </span>;
  });
};

export default TodoText;
