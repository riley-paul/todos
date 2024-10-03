import React from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Props {
  initialValue: string;
  saveValue: (name: string) => void;
  displayClassName?: string;
  placeholder?: string;
}

const ConditionalValueEditor: React.FC<Props> = (props) => {
  const { initialValue, saveValue, displayClassName, placeholder } = props;

  const ref = React.useRef<HTMLFormElement>(null);

  useOnClickOutside(ref, () => {
    setValue(initialValue);
    setIsEditing(false);
  });

  const [value, setValue] = React.useState(initialValue);
  const [isEditing, setIsEditing] = React.useState(false);

  if (isEditing) {
    return (
      <form
        ref={ref}
        className="flex w-full items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          saveValue(value);
          setIsEditing(false);
        }}
      >
        <Input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
        <input type="submit" hidden />
        <Button
          className="shrink-0"
          type="submit"
          variant="secondary"
          size="icon"
        >
          <i className="fa-solid fa-check" />
        </Button>
      </form>
    );
  }

  return (
    <div className="flex w-full items-center gap-2">
      <span className={cn(displayClassName, "flex-1")}>{initialValue}</span>
      <Button
        variant="ghostMuted"
        size="icon"
        onClick={() => {
          setIsEditing(true);
          setValue(initialValue);
        }}
        className="shrink-0"
      >
        <i className="fa-solid fa-pencil" />
      </Button>
    </div>
  );
};

export default ConditionalValueEditor;
