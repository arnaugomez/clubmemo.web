"use client";
import { waitMilliseconds } from "@/src/core/app/utils/promises";
import AsyncCreatableSelect from "react-select/async-creatable";
import { toast } from "sonner";

interface TagsInputProps {
  name: string;
  id?: string;
  label: string;
  placeholder?: string;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function TagsInput({
  name,
  id,
  placeholder,
  value,
  onChange,
}: TagsInputProps) {
  const loadExistingTags = async (text: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const query = text.trim();
      await waitMilliseconds(2000);
      const fetchedOptions = initialOptions;
      return fetchedOptions.map((tag) => ({ value: tag, label: tag }));
    } catch (e) {
      console.error(e);
      toast.error("Error al cargar etiquetas");
    }
    return [];
  };

  return (
    <AsyncCreatableSelect
      name={name}
      id={id}
      value={value.map((tag) => ({ value: tag, label: tag }))}
      onChange={(selectedOptions) => {
        onChange(selectedOptions.map((option) => option.value));
      }}
      createOptionPosition="first"
      isValidNewOption={(inputValue, _, accessors) =>
        /^[a-zA-Z0-9-_ ]+$/.test(inputValue) &&
        !accessors.some(
          (option) => "value" in option && option.value === inputValue,
        )
      }
      isMulti
      loadOptions={loadExistingTags}
      loadingMessage={() => "Cargando..."}
      placeholder={placeholder}
    />
  );
}

const initialOptions = Array.from({ length: 100 }).map((_, index) =>
  index.toString(),
);
