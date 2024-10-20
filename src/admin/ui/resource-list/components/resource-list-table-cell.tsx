import type { AdminResourceData } from "@/src/admin/domain/models/admin-resource-data";
import type {
  AdminFieldModel,
  AdminResourceTypeModel,
} from "@/src/admin/domain/models/admin-resource-model";
import { AdminFieldTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import { TableCell } from "@/src/common/ui/components/shadcn/ui/table";
import { formatDate, isDate, isValid } from "date-fns";
import { translateAdminKey } from "../../i18n/admin-translations";
import { FileTableCell } from "./file-table-cell";
import { IdTableCell } from "./id-table-cell";

interface ResourceListTableCellProps {
  resourceType: AdminResourceTypeModel;
  field: AdminFieldModel;
  data: AdminResourceData;
}

/**
 * Displays a value of an admin resource in a cell of the resource list table.
 *
 * The value is displayed according to the field type. For example, if the field
 * is a date, the value is formatted as a date.
 */
export function ResourceListTableCell({
  resourceType,
  field,
  data,
}: ResourceListTableCellProps) {
  function getOptionLabel(value: unknown) {
    return value
      ? translateAdminKey(
          resourceType,
          "field",
          field.name,
          "option",
          value.toString(),
          "label",
        )
      : "-";
  }
  function getStringValue() {
    const value = data[field.name];
    switch (field.fieldType) {
      case AdminFieldTypeModel.boolean:
        return value ? "Sí" : "No";
      case AdminFieldTypeModel.date:
        if (!value || !isDate(value)) return "-";
        return isValid(value)
          ? formatDate(value, "dd/MM/yyyy")
          : "Fecha inválida";
      case AdminFieldTypeModel.select:
        return getOptionLabel(value);
      case AdminFieldTypeModel.selectMultiple:
        return Array.isArray(value)
          ? value.map(getOptionLabel).join(", ")
          : "-";
      case AdminFieldTypeModel.form:
        return value ? "Dato estructurado" : "-";
    }
    return value?.toString() || "-";
  }
  switch (field.fieldType) {
    case AdminFieldTypeModel.objectId:
      return (
        <IdTableCell
          key={field.name}
          id={data[field.name]}
          resourceType={field.resourceType}
        />
      );
    case AdminFieldTypeModel.file:
      return <FileTableCell href={data[field.name]} />;
    default:
      return (
        <TableCell
          className="min-w-[100px] max-w-[500px] truncate"
          key={field.name}
        >
          {getStringValue()}
        </TableCell>
      );
  }
}
