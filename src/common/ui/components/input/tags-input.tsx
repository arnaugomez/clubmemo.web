"use client";
import AsyncCreatableSelect from "react-select/async-creatable";
import { toast } from "sonner";
import { captureError } from "@/src/common/effect/client-runtime";
import { getTagSuggestionsAction } from "../../../../tags/ui/actions/get-tag-suggestions-action";
import { ActionResponseHandler } from "../../models/action-response-handler";

interface TagsInputProps {
  name: string;
  id?: string;
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
      const query = text.trim();
      const response = await getTagSuggestionsAction({ query });
      const handler = new ActionResponseHandler(response);
      handler.toastErrors();

      return handler.data?.map((tag) => ({ value: tag, label: tag })) ?? [];
    } catch (error) {
      captureError(error);
      toast.error("Error al cargar etiquetas");
    }
    return [];
  };

  return (
    <AsyncCreatableSelect
      name={name}
      id={id}
      value={value.map((tag) => ({ value: tag, label: tag }))}
      onChange={(
        selectedOptions: readonly { value: string; label: string }[],
      ) => {
        onChange(selectedOptions.map((option) => option.value));
      }}
      createOptionPosition="first"
      isValidNewOption={(inputValue: string) =>
        inputValue.length <= 50 && /^[a-zA-Z0-9-_ ]+$/.test(inputValue)
      }
      isMulti
      loadOptions={loadExistingTags}
      defaultOptions
      loadingMessage={() => "Cargando..."}
      placeholder={placeholder}
      allowCreateWhileLoading
      noOptionsMessage={() => <>No hay etiquetas. ¡Crea una!</>}
    />
  );
}
