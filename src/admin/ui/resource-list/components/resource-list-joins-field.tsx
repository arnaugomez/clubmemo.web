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

/**
 * Displays a field in the admin resource filters form, when the
 * field is a join.
 */
export function ResourceListJoinsField(props: ResourceListJoinsFieldProps) {
  const childProps = useAdminJoinProps(props);
  return <InputFormField {...childProps} />;
}

/**
 * Get the props for the input field of a join field in the admin resource filters form.
 *
 * @returns The props for the input field.
 */
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
