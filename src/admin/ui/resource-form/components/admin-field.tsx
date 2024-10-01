import type { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import {
  AdminFieldTypeModel,
  type AdminFieldModel,
} from "@/src/admin/domain/models/admin-resource-model";
import { CheckboxFormField } from "@/src/common/ui/components/form/checkbox-form-field";
import { DateInputFormField } from "@/src/common/ui/components/form/date-input-form-field";
import { InputFormField } from "@/src/common/ui/components/form/input-form-field";
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
  return (
    <InputFormField
      name={field.name}
      label={translateAdminKey(resourceType, "field", field.name, "label")}
      placeholder={translateAdminKey(
        resourceType,
        "field",
        field.name,
        "placeholder",
      )}
    />
  );
}
function AdminFieldBoolean({ resourceType, field }: ResourceFormFieldProps) {
  return (
    <CheckboxFormField
      name={field.name}
      label={translateAdminKey(resourceType, "field", field.name, "label")}
    />
  );
}

function AdminFieldDate({ resourceType, field }: ResourceFormFieldProps) {
  return (
    <DateInputFormField
      name={field.name}
      label={translateAdminKey(resourceType, "field", field.name, "label")}
      placeholder={translateAdminKey(
        resourceType,
        "field",
        field.name,
        "placeholder",
      )}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AdminFieldForm({ resourceType, field }: ResourceFormFieldProps) {
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AdminFieldNumber({ resourceType, field }: ResourceFormFieldProps) {
  return null;
}

function AdminFieldObjectId({ resourceType, field }: ResourceFormFieldProps) {
  return (
    <InputFormField
      name={field.name}
      label={translateAdminKey(resourceType, "field", field.name, "label")}
      placeholder={translateAdminKey(
        resourceType,
        "field",
        field.name,
        "placeholder",
      )}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AdminFieldTags({ resourceType, field }: ResourceFormFieldProps) {
  return null;
}

function AdminFieldRichText({ resourceType, field }: ResourceFormFieldProps) {
  return (
    <WysiwygFormField
      name={field.name}
      label={translateAdminKey(resourceType, "field", field.name, "label")}
      placeholder={translateAdminKey(
        resourceType,
        "field",
        field.name,
        "placeholder",
      )}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AdminFieldSelect({ resourceType, field }: ResourceFormFieldProps) {
  return null;
}

function AdminFieldSelectMultiple({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resourceType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  field,
}: ResourceFormFieldProps) {
  return null;
}
