import type { AdminFieldModel } from "@/src/admin/domain/models/admin-resource-model";
import {
  AdminFieldTypeModel,
  type AdminResourceModel,
} from "@/src/admin/domain/models/admin-resource-model";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import { chunk } from "lodash-es";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";
import { ResourceListFiltersField } from "./resource-list-filters-field";

interface ResourceListFiltersFormProps {
  resource: AdminResourceModel;
  onHideFilters: () => void;
}
export function ResourceListFiltersForm({
  resource,
  onHideFilters,
}: ResourceListFiltersFormProps) {
  const configVisibleFields = useMemo(
    () => resource.fields.filter((field) => !field.hideInList),
    [resource.fields],
  );
  const params = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const filtersString = params.get("filters") ?? "";
  const filters = useMemo(() => {
    try {
      const object = JSON.parse(filtersString);
      return z.record(z.unknown()).parse(object);
    } catch {
      return {};
    }
  }, [filtersString]);

  const form = useForm({
    defaultValues: Object.keys(filters).length
      ? filters
      : getDefaultValues(configVisibleFields),
  });
  const values = form.watch();

  const setQuery = useDebouncedCallback((values: Record<string, unknown>) => {
    const newParams = new URLSearchParams(params);
    if (Object.keys(values).length) {
      const stringValues = JSON.stringify(values);
      newParams.set("filters", stringValues);
    } else {
      newParams.delete("filters");
    }
    newParams.set("page", "1");
    push(`${pathname}?${newParams.toString()}`);
  }, 500);

  useEffect(() => {
    const cleanedValues = cleanValues(configVisibleFields, values);
    const stringValues = Object.keys(cleanedValues).length
      ? JSON.stringify(cleanedValues)
      : "";
    if (stringValues !== filtersString) {
      setQuery(cleanedValues);
    }
  }, [configVisibleFields, filtersString, setQuery, values]);

  return (
    <FormProvider {...form}>
      <form
        onReset={() => form.reset(getDefaultValues(configVisibleFields))}
        onSubmit={form.handleSubmit(() => {})}
        className="mt-2 space-y-4 rounded-md border-[1px] border-slate-300 bg-slate-100 p-4"
      >
        <h3 className={cn(textStyles.h4)}>Filtros</h3>
        {chunk(configVisibleFields, 2).map((fields) => (
          <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4" key={fields[0].name}>
            {fields.map((field) => (
              <div className="flex-1" key={field.name}>
                <ResourceListFiltersField
                  resourceType={resource.resourceType}
                  field={field}
                />
              </div>
            ))}
          </div>
        ))}
        <div className="flex justify-between space-x-6">
          <Button variant="secondary" type="reset">
            Limpiar filtros
          </Button>
          <Button type="button" onClick={onHideFilters}>
            Ocultar filtros
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

function cleanValues(
  fields: AdminFieldModel[],
  values: Record<string, unknown>,
) {
  const newValues: Record<string, unknown> = {};
  for (const field of fields) {
    const value = values[field.name];
    switch (field.fieldType) {
      case AdminFieldTypeModel.string:
      case AdminFieldTypeModel.objectId:
        if (value) {
          newValues[field.name] = value;
        }
        break;
      case AdminFieldTypeModel.number:
      case AdminFieldTypeModel.boolean:
      case AdminFieldTypeModel.date:
      case AdminFieldTypeModel.select:
        if (value !== null) {
          newValues[field.name] = value;
        }
        break;
      case AdminFieldTypeModel.selectMultiple:
      case AdminFieldTypeModel.tags:
        if (Array.isArray(value) && value.length) {
          newValues[field.name] = value;
        }
        break;
    }
  }
  return newValues;
}

function getDefaultValues(fields: AdminFieldModel[]) {
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    switch (field.fieldType) {
      case AdminFieldTypeModel.string:
      case AdminFieldTypeModel.objectId:
        values[field.name] = "";
        break;
      case AdminFieldTypeModel.number:
      case AdminFieldTypeModel.boolean:
      case AdminFieldTypeModel.date:
      case AdminFieldTypeModel.select:
        values[field.name] = null;
        break;
      case AdminFieldTypeModel.selectMultiple:
      case AdminFieldTypeModel.tags:
        values[field.name] = [];
        break;
    }
  }
  return values;
}
