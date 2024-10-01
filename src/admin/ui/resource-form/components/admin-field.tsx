import type { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import {
  AdminFieldTypeModel,
  type AdminFieldModel,
} from "@/src/admin/domain/models/admin-resource-model";
import type { OptionModel } from "@/src/common/domain/models/option-model";
import { CheckboxFormField } from "@/src/common/ui/components/form/checkbox-form-field";
import { DateInputFormField } from "@/src/common/ui/components/form/date-input-form-field";
import { InputFormField } from "@/src/common/ui/components/form/input-form-field";
import { NumberInputFormField } from "@/src/common/ui/components/form/number-input-form-field";
import { SelectFormField } from "@/src/common/ui/components/form/select-form-field";
import { TagsFormField } from "@/src/common/ui/components/form/tags-form-field";
import { WysiwygFormField } from "@/src/common/ui/components/form/wysiwyg-form-field";
import type { FunctionComponent } from "react";
import { translateAdminKey } from "../../i18n/admin-translations";

export interface ResourceFormFieldProps {
  resourceType: AdminResourceTypeModel;
  field: AdminFieldModel;
}

const componentMap: Record<
  AdminFieldTypeModel,
  FunctionComponent<ResourceFormFieldProps>
> = {
  [AdminFieldTypeModel.boolean]: AdminFieldBoolean,
  [AdminFieldTypeModel.date]: AdminFieldDate,
  [AdminFieldTypeModel.form]: AdminFieldForm,
  [AdminFieldTypeModel.number]: AdminFieldNumber,
  [AdminFieldTypeModel.objectId]: AdminFieldObjectId,
  [AdminFieldTypeModel.string]: AdminFieldString,
  [AdminFieldTypeModel.tags]: AdminFieldTags,
  [AdminFieldTypeModel.richText]: AdminFieldRichText,
  [AdminFieldTypeModel.select]: AdminFieldSelect,
  [AdminFieldTypeModel.selectMultiple]: AdminFieldSelectMultiple,
};

export function AdminField(props: ResourceFormFieldProps) {
  const Component = componentMap[props.field.fieldType];

  return <Component {...props} />;
}

function AdminFieldString({ resourceType, field }: ResourceFormFieldProps) {
  const props = useLabelAndPlaceholder({ resourceType, field });
  return <InputFormField name={field.name} {...props} />;
}
function AdminFieldBoolean({ resourceType, field }: ResourceFormFieldProps) {
  const props = useLabelAndPlaceholder({ resourceType, field });
  return <CheckboxFormField name={field.name} {...props} />;
}

function AdminFieldDate({ resourceType, field }: ResourceFormFieldProps) {
  const props = useLabelAndPlaceholder({ resourceType, field });
  return <DateInputFormField name={field.name} {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AdminFieldForm({ resourceType, field }: ResourceFormFieldProps) {
  return null;
}

function AdminFieldNumber({ resourceType, field }: ResourceFormFieldProps) {
  const props = useLabelAndPlaceholder({ resourceType, field });
  return <NumberInputFormField name={field.name} {...props} />;
}

function AdminFieldObjectId({ resourceType, field }: ResourceFormFieldProps) {
  const props = useLabelAndPlaceholder({ resourceType, field });
  return <InputFormField name={field.name} {...props} />;
}

function AdminFieldTags({ resourceType, field }: ResourceFormFieldProps) {
  const props = useLabelAndPlaceholder({ resourceType, field });
  return <TagsFormField name={field.name} {...props} />;
}

function AdminFieldRichText({ resourceType, field }: ResourceFormFieldProps) {
  const props = useLabelAndPlaceholder({ resourceType, field });
  return <WysiwygFormField name={field.name} {...props} />;
}

function AdminFieldSelect({ resourceType, field }: ResourceFormFieldProps) {
  const props = useLabelAndPlaceholder({ resourceType, field });
  return (
    <SelectFormField
      name={field.name}
      options={getOptions({ resourceType, field })}
      {...props}
    />
  );
}

function AdminFieldSelectMultiple({
  resourceType,
  field,
}: ResourceFormFieldProps) {
  const props = useLabelAndPlaceholder({ resourceType, field });
  return (
    <SelectFormField
      isMultiple
      name={field.name}
      options={getOptions({ resourceType, field })}
      {...props}
    />
  );
}

function useLabelAndPlaceholder({
  resourceType,
  field,
}: ResourceFormFieldProps) {
  return {
    label: translateAdminKey(resourceType, "field", field.name, "label"),
    placeholder: translateAdminKey(
      resourceType,
      "field",
      field.name,
      "placeholder",
    ),
  };
}

function getOptions({
  resourceType,
  field,
}: ResourceFormFieldProps): OptionModel[] {
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
