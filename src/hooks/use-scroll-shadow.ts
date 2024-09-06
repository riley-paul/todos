import React from "react";
import invariant from "tiny-invariant";

export default function useScrollShadow() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = listRef.current;
    invariant(element);

    const handleScroll = () => {
      if (element.scrollTop > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    element.addEventListener("scroll", handleScroll);

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { listRef, isScrolled };
}
