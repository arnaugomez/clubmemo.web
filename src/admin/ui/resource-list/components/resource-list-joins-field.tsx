import type {
  AdminJoinModel,
  AdminResourceTypeModel,
} from "@/src/admin/domain/models/admin-resource-model";

import { InputFormField } from "@/src/common/ui/components/form/input-form-field";
import { translateAdminKey } from "../../i18n/admin-translations";
import { useAdminFormFieldContext } from "../../resource-form/context/admin-form-field-context";

export interface ResourceListJoinsFieldProps {
  resourceType: AdminResourceTypeModel;
  join: AdminJoinModel;
}

export function ResourceListJoinsField(props: ResourceListJoinsFieldProps) {
  const childProps = useAdminJoinProps(props);
  return <InputFormField {...childProps} />;
}

function useAdminJoinProps({
  resourceType,
  join,
}: ResourceListJoinsFieldProps) {
  const { getName } = useAdminFormFieldContext();
  return {
    name: getName(join.name),
    label: `${translateAdminKey(resourceType, "field", join.name, "tableHeader")} (${join.name})`,
    placeholder: translateAdminKey(
      resourceType,
      "field",
      join.name,
      "placeholder",
    ),
  };
}
