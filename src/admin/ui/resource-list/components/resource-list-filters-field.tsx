import type { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import {
  AdminFieldDisplayModel,
  AdminFieldTypeModel,
  type AdminFieldModel,
} from "@/src/admin/domain/models/admin-resource-model";
import type { OptionModel } from "@/src/common/domain/models/option-model";
import { CheckboxFormField } from "@/src/common/ui/components/form/checkbox-form-field";
import { DateInputFormField } from "@/src/common/ui/components/form/date-input-form-field";
import { InputFormField } from "@/src/common/ui/components/form/input-form-field";
import { NumberInputFormField } from "@/src/common/ui/components/form/number-input-form-field";
import { ObjectIdInputFormField } from "@/src/common/ui/components/form/objectid-input-form-field";
import { SelectFormField } from "@/src/common/ui/components/form/select-form-field";
import { SliderFormField } from "@/src/common/ui/components/form/slider-form-field";
import { TagsFormField } from "@/src/common/ui/components/form/tags-form-field";
import type { FunctionComponent } from "react";
import { translateAdminKey } from "../../i18n/admin-translations";
import { useAdminFormFieldContext } from "../../resource-form/context/admin-form-field-context";

export interface ResourceListFiltersFieldProps {
  resourceType: AdminResourceTypeModel;
  field: AdminFieldModel;
}

const componentMap: Record<
  AdminFieldTypeModel,
  FunctionComponent<ResourceListFiltersFieldProps>
> = {
  [AdminFieldTypeModel.boolean]: AdminFieldBoolean,
  [AdminFieldTypeModel.date]: AdminFieldDate,
  [AdminFieldTypeModel.form]: () => null,
  [AdminFieldTypeModel.number]: AdminFieldNumber,
  [AdminFieldTypeModel.objectId]: AdminFieldObjectId,
  [AdminFieldTypeModel.string]: AdminFieldString,
  [AdminFieldTypeModel.tags]: AdminFieldTags,
  [AdminFieldTypeModel.richText]: AdminFieldString,
  [AdminFieldTypeModel.select]: AdminFieldSelect,
  [AdminFieldTypeModel.selectMultiple]: AdminFieldSelectMultiple,
  [AdminFieldTypeModel.file]: () => null,
};

export function ResourceListFiltersField(props: ResourceListFiltersFieldProps) {
  const Component = componentMap[props.field.fieldType];

  return <Component {...props} />;
}

function AdminFieldString({
  resourceType,
  field,
}: ResourceListFiltersFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  return <InputFormField {...props} />;
}

function AdminFieldBoolean({
  resourceType,
  field,
}: ResourceListFiltersFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  return (
    <div className="py-3">
      <CheckboxFormField {...props} />
    </div>
  );
}

function AdminFieldDate({
  resourceType,
  field,
}: ResourceListFiltersFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  return <DateInputFormField {...props} />;
}

function AdminFieldNumber({
  resourceType,
  field,
}: ResourceListFiltersFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  switch (field.display) {
    case AdminFieldDisplayModel.slider:
      return <SliderFormField max={100} {...props} />;
  }
  return <NumberInputFormField {...props} />;
}

function AdminFieldObjectId({
  resourceType,
  field,
}: ResourceListFiltersFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  return (
    <ObjectIdInputFormField resourceType={field.resourceType} {...props} />
  );
}

function AdminFieldTags({
  resourceType,
  field,
}: ResourceListFiltersFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  return <TagsFormField {...props} />;
}

function AdminFieldSelect({
  resourceType,
  field,
}: ResourceListFiltersFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  return (
    <SelectFormField options={getOptions({ resourceType, field })} {...props} />
  );
}

function AdminFieldSelectMultiple({
  resourceType,
  field,
}: ResourceListFiltersFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  return (
    <SelectFormField
      isMultiple
      options={getOptions({ resourceType, field })}
      {...props}
    />
  );
}

function useAdminFieldProps({
  resourceType,
  field,
}: ResourceListFiltersFieldProps) {
  const { getName } = useAdminFormFieldContext();
  return {
    name: getName(field.name),
    label: `${translateAdminKey(resourceType, "field", field.name, "tableHeader")} (${field.name})`,
    disabled: field.isReadonly,
    placeholder: translateAdminKey(
      resourceType,
      "field",
      field.name,
      "placeholder",
    ),
    ...field.extraProps,
  };
}

function getOptions({
  resourceType,
  field,
}: ResourceListFiltersFieldProps): OptionModel[] {
  return (
    field.options?.map((option) => ({
      label: translateAdminKey(
        resourceType,
        "field",
        field.name,
        "option",
        option,
        "label",
      ),
      value: option,
    })) ?? []
  );
}
