import { Checkbox, CheckboxProps } from "@heroui/react";
import { FC } from "react";

interface CheckBoxProps extends CheckboxProps {
  text: string;
  error?: string;
}
const CheckBoxUI: FC<CheckBoxProps> = ({ error, text, ...prop }) => {
  return (
    <div className="flex flex-col gap-1">
      <Checkbox
        isRequired
        classNames={{
          label: "text-small",
        }}
        {...prop}
      >
        {text}
      </Checkbox>
      {error && <p className="text-danger text-small">{error}</p>}
    </div>
  );
};

export default CheckBoxUI;
