import type {
  AdminFieldModel,
  AdminResourceTypeModel,
} from "../../domain/models/admin-resource-model";
import { AdminField } from "./components/admin-field";

interface Props {
  resourceType: AdminResourceTypeModel;
  fields: AdminFieldModel[];
}
/**
 * Displays a list of fields in the form of the admin panel.
 *
 */
export function AdminFields({ resourceType, fields }: Props) {
  return (
    <>
      {fields.map((field) => (
        <AdminField
          key={field.name}
          field={field}
          resourceType={resourceType}
        />
      ))}
    </>
  );
}
