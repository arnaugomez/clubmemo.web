import type { OptionModel } from "@/src/common/domain/models/option-model";
import Select from "react-select";

interface SelectMultipleInputProps {
  name: string;
  id?: string;
  placeholder?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: OptionModel[];
  className?: string;
  disabled?: boolean;
}

export function SelectMultipleInput({
  name,
  id,
  placeholder,
  value,
  onChange,
  options,
  className,
  disabled,
}: SelectMultipleInputProps) {
  return (
    <Select
      inputId={id}
      placeholder={placeholder}
      value={options.filter((option) => value.includes(option.value))}
      isMulti
      onChange={(selectedOptions) =>
        onChange(selectedOptions.map((option) => option.value))
      }
      className={className}
      isDisabled={disabled}
      isClearable
      isSearchable
      name={name}
      options={options}
      noOptionsMessage={() => "No hay opciones"}
    />
  );
}
