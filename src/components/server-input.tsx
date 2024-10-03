import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUnmount } from "usehooks-ts";

type Props = {
  currentValue: string | undefined | null;
  onUpdate: (value: string | undefined) => void;
  selectOnFocus?: boolean;
} & React.ComponentProps<typeof Input>;

const ServerInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { currentValue, onUpdate, selectOnFocus, ...rest } = props;

  const [value, setValue] = React.useState<string>(currentValue ?? "");

  const update = () => {
    if (value !== currentValue) onUpdate(value);
  };

  useUnmount(update);

  return (
    <Input
      {...rest}
      className={cn(props.className)}
      ref={ref}
      value={value}
      onChange={(ev) => setValue(ev.target.value)}
      onBlur={() => {
        update();
      }}
      onFocus={(ev) => {
        if (selectOnFocus) ev.target.select();
      }}
      onKeyDown={(ev) => {
        const target = ev.target as HTMLInputElement;
        if (ev.key === "Enter" || ev.key === "Escape") {
          ev.preventDefault();
          update();
          target.blur();
        }
      }}
      autoComplete="off"
    />
  );
});

export default ServerInput;
