import React from "react";

type Props = { src: string };

const Illustration: React.FC<Props> = ({ src }) => {
  return (
    <div className="flex size-36 items-center justify-center rounded-full border border-gray-6 bg-[white]">
      <img src={src} className="w-24" />
    </div>
  );
};

export default Illustration;
