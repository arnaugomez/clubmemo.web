import type { OptionModel } from "@/src/common/domain/models/option-model";
import Select from "react-select";

interface SelectInputProps {
  name: string;
  id?: string;
  placeholder?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: OptionModel[];
  className?: string;
  disabled?: boolean;
}

export function SelectInput({
  name,
  id,
  placeholder,
  value,
  onChange,
  options,
  className,
  disabled,
}: SelectInputProps) {
  return (
    <Select
      inputId={id}
      placeholder={placeholder}
      value={options.find((option) => option.value === value) ?? null}
      onChange={(selectedOption) => onChange(selectedOption?.value ?? null)}
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
