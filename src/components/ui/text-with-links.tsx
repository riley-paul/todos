import { Link } from "@radix-ui/themes";
import React from "react";

const TextWithLinks: React.FC<{ text: string }> = ({ text }) => {
  const linkRegex = /(https?:\/\/[^\s]+)/g;

  const renderTextWithLinks = (text: string) => {
    return text.split(linkRegex).map((part, index) => {
      if (linkRegex.test(part)) {
        return (
          <Link
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  return <>{renderTextWithLinks(text)}</>;
};

export default TextWithLinks;
