import React from "react";
import { Input, InputProps } from "@heroui/react";

interface TextFieldProps extends InputProps {}

const TextField: React.FC<TextFieldProps> = ({
  labelPlacement = "outside",
  ...props
}) => {
  return <Input labelPlacement={labelPlacement} {...props} />;
};

export default TextField;
