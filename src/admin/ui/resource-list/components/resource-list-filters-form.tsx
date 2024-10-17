import type {
  AdminFieldModel,
  AdminJoinModel,
} from "@/src/admin/domain/models/admin-resource-model";
import {
  AdminFieldTypeModel,
  type AdminResourceModel,
} from "@/src/admin/domain/models/admin-resource-model";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import chunk from "lodash/chunk";
import { FilterXIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";
import { ResourceListFiltersField } from "./resource-list-filters-field";
import { ResourceListJoinsField } from "./resource-list-joins-field";

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

  const defaultValues = useMemo(
    () => getDefaultValues(configVisibleFields, resource.joins ?? [], filters),
    [configVisibleFields, filters, resource.joins],
  );

  const form = useForm({
    defaultValues,
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
    push(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, 500);

  useEffect(() => {
    const cleanedValues = cleanValues(
      configVisibleFields,
      resource.joins ?? [],
      values,
    );
    const stringValues = Object.keys(cleanedValues).length
      ? JSON.stringify(cleanedValues)
      : "";
    if (stringValues !== filtersString) {
      setQuery(cleanedValues);
    }
  }, [configVisibleFields, filtersString, resource.joins, setQuery, values]);

  const fieldsAndJoins = [...(resource.joins ?? []), ...configVisibleFields];

  return (
    <FormProvider {...form}>
      <form
        onReset={() =>
          form.reset(getResetValues(configVisibleFields, resource.joins ?? []))
        }
        onSubmit={form.handleSubmit(() => {})}
        className="mt-2 space-y-4 rounded-md border-[1px] border-slate-300 bg-slate-100 p-4"
      >
        <h3 className={cn(textStyles.h4)}>Filtros</h3>
        {resource.joins?.map((join) => (
          <div className="flex-1" key={join.name}></div>
        ))}
        {chunk(fieldsAndJoins, 2).map((group) => (
          <div
            className="space-y-4 sm:flex sm:space-x-4 sm:space-y-0"
            key={group[0].name}
          >
            {group.map((fieldOrJoin) => {
              function renderField() {
                if ("foreignField" in fieldOrJoin) {
                  return (
                    <ResourceListJoinsField
                      resourceType={resource.resourceType}
                      join={fieldOrJoin}
                    />
                  );
                } else {
                  return (
                    <ResourceListFiltersField
                      resourceType={resource.resourceType}
                      field={fieldOrJoin}
                    />
                  );
                }
              }
              return (
                <div className="flex-1" key={fieldOrJoin.name}>
                  {renderField()}
                </div>
              );
            })}
          </div>
        ))}
        <div className="flex justify-between space-x-6">
          <Button variant="secondary" type="reset">
            <FilterXIcon className="mr-2 size-4" />
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
  joins: AdminJoinModel[],
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
  for (const join of joins) {
    const value = values[join.name];
    if (value) {
      newValues[join.name] = value;
    }
  }
  return newValues;
}

function getResetValues(fields: AdminFieldModel[], joins: AdminJoinModel[]) {
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
  for (const join of joins) {
    values[join.name] = "";
  }
  return values;
}

function getDefaultValues(
  fields: AdminFieldModel[],
  joins: AdminJoinModel[],
  filters: Record<string, unknown>,
) {
  const values = { ...filters };

  for (const field of fields) {
    const value = values[field.name];
    switch (field.fieldType) {
      case AdminFieldTypeModel.string:
      case AdminFieldTypeModel.objectId:
        if (typeof value !== "string") {
          values[field.name] = "";
        }
        break;
      case AdminFieldTypeModel.number:
      case AdminFieldTypeModel.boolean:
      case AdminFieldTypeModel.date:
      case AdminFieldTypeModel.select:
        if (value === undefined) {
          values[field.name] = null;
        }
        break;
      case AdminFieldTypeModel.selectMultiple:
      case AdminFieldTypeModel.tags:
        if (!Array.isArray(value)) {
          values[field.name] = [];
        }
        break;
    }
  }
  for (const join of joins) {
    if (typeof values[join.name] !== "string") {
      values[join.name] = "";
    }
  }
  return values;
}
