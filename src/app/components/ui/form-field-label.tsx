import { Text } from "@radix-ui/themes";
import React from "react";

type Props = React.PropsWithChildren<{
  label: string;
}>;

const FormFieldLabel: React.FC<Props> = ({ children, label }) => {
  return (
    <Text as="label" size="2" weight="bold" className="grid h-fit gap-2">
      {label}
      {children}
    </Text>
  );
};

export default FormFieldLabel;
