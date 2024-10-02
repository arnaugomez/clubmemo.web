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
import { PasswordInputFormField } from "@/src/common/ui/components/form/password-input-form-field";
import { SelectFormField } from "@/src/common/ui/components/form/select-form-field";
import { TagsFormField } from "@/src/common/ui/components/form/tags-form-field";
import { TextareaFormField } from "@/src/common/ui/components/form/textarea-form-field";
import { WysiwygFormField } from "@/src/common/ui/components/form/wysiwyg-form-field";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { BracesIcon } from "lucide-react";
import type { FunctionComponent } from "react";
import { translateAdminKey } from "../../i18n/admin-translations";
import { AdminFields } from "../admin-fields";
import {
  AdminFormFieldContextProvider,
  useAdminFormFieldContext,
} from "../context/admin-form-field-context";

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
  const props = useAdminFieldProps({ resourceType, field });
  switch (field.display) {
    case AdminFieldDisplayModel.textarea:
      return <TextareaFormField {...props} />;
    case AdminFieldDisplayModel.password:
      return <PasswordInputFormField {...props} />;
  }
  return <InputFormField {...props} />;
}
function AdminFieldBoolean({ resourceType, field }: ResourceFormFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  return <CheckboxFormField {...props} />;
}

function AdminFieldDate({ resourceType, field }: ResourceFormFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  return <DateInputFormField {...props} />;
}

function AdminFieldForm({ resourceType, field }: ResourceFormFieldProps) {
  const { label, name } = useAdminFieldProps({ resourceType, field });
  return (
    <div>
      <h3 className={textStyles.h4}>
        <BracesIcon className="mr-2 inline size-5 -translate-y-px" />
        {label}
      </h3>
      <div className="h-2"></div>
      <div className="ml-[9px] space-y-4 border-l-2 border-slate-200 py-2 pl-5">
        <AdminFormFieldContextProvider prefix={name}>
          <AdminFields
            resourceType={resourceType}
            fields={field.fields ?? []}
          />
        </AdminFormFieldContextProvider>
      </div>
    </div>
  );
}

function AdminFieldNumber({ resourceType, field }: ResourceFormFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  return <NumberInputFormField {...props} />;
}

function AdminFieldObjectId({ resourceType, field }: ResourceFormFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  return <InputFormField {...props} />;
}

function AdminFieldTags({ resourceType, field }: ResourceFormFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  return <TagsFormField {...props} />;
}

function AdminFieldRichText({ resourceType, field }: ResourceFormFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  return <WysiwygFormField {...props} />;
}

function AdminFieldSelect({ resourceType, field }: ResourceFormFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  return (
    <SelectFormField options={getOptions({ resourceType, field })} {...props} />
  );
}

function AdminFieldSelectMultiple({
  resourceType,
  field,
}: ResourceFormFieldProps) {
  const props = useAdminFieldProps({ resourceType, field });
  return (
    <SelectFormField
      isMultiple
      options={getOptions({ resourceType, field })}
      {...props}
    />
  );
}

function useAdminFieldProps({ resourceType, field }: ResourceFormFieldProps) {
  const { getName } = useAdminFormFieldContext();
  return {
    name: getName(field.name),
    label: translateAdminKey(resourceType, "field", field.name, "label"),
    disabled: field.isReadonly,
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
