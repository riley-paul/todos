import React from "react";
import { Link } from "react-router-dom";

type Props = {
  string: string;
  tag: string;
};

const HashtagLink: React.FC<Props> = (props) => {
  const {} = props;

  return (
    <Link
      to={`/?tag=${props.tag}`}
      onClick={(e) => e.stopPropagation()}
      className="text-primary hover:underline"
    >
      {props.string}
    </Link>
  );
};

export default HashtagLink;
