import { Text } from "@radix-ui/themes";
import React from "react";
import type { FieldError } from "react-hook-form";

type Props = { error?: FieldError };

const FormFieldError: React.FC<Props> = ({ error }) => {
  if (error) {
    return (
      <Text size="1" color="red" ml="2">
        {error.message}
      </Text>
    );
  }

  return null;
};

export default FormFieldError;
