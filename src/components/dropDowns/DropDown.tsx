import { Select, SelectItem, SelectProps } from "@heroui/react";
import { FC } from "react";

interface DropDownProps extends SelectProps {
  label: string;
  name: string;
  placeholder: string;
  options: OptionsProps[];
  children?: React.ReactNode;
}

type OptionsProps = {
  value: string;
  label: string;
};

const defaultOptions = [{ value: "ar", label: "Argentina" }] as OptionsProps[];
const DropDown: FC<DropDownProps> = ({
  label = "Country",
  name = "country",
  placeholder = "Select country",
  labelPlacement = "outside",
  options = defaultOptions,
  ...props
}) => {
  return (
    <Select
      isRequired
      label={label}
      labelPlacement={labelPlacement}
      name={name}
      placeholder={placeholder}
      {...props}
    >
      {options.map((option: OptionsProps) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default DropDown;
