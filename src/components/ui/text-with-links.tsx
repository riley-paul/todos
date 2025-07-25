import { Badge } from "@radix-ui/themes";
import { Link2Icon } from "lucide-react";
import React from "react";

function getDomain(url: string) {
  const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/:]+)/i);
  return match ? match[1] : null;
}

const TextWithLinks: React.FC<{ text: string }> = ({ text }) => {
  const linkRegex = /(https?:\/\/[^\s]+)/g;

  const renderTextWithLinks = (text: string) => {
    return text.split(linkRegex).map((part, index) => {
      if (linkRegex.test(part)) {
        return (
          <Badge asChild key={index} title={part} color="gray">
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {getDomain(part)}
              <Link2Icon className="inline size-3 opacity-70" />
            </a>
          </Badge>
        );
      }
      return part;
    });
  };

  return <>{renderTextWithLinks(text)}</>;
};

export default TextWithLinks;
