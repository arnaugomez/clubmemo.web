import type { AdminResourceData } from "@/src/admin/domain/models/admin-resource-data";
import type {
  AdminFieldModel,
  AdminResourceTypeModel,
} from "@/src/admin/domain/models/admin-resource-model";
import { AdminFieldTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import { TableCell } from "@/src/common/ui/components/shadcn/ui/table";
import dayjs from "dayjs";
import { translateAdminKey } from "../../i18n/admin-translations";
import { IdTableCell } from "./id-table-cell";

interface ResourceListTableCellProps {
  resourceType: AdminResourceTypeModel;
  field: AdminFieldModel;
  data: AdminResourceData;
}
export function ResourceListTableCell({
  resourceType,
  field,
  data,
}: ResourceListTableCellProps) {
  function getOptionLabel(fieldName: string, value: unknown) {
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
        if (!value) return "-";
        const date = dayjs(value);
        return date.isValid() ? date.format("DD/MM/YYYY") : "Fecha inválida";
      case AdminFieldTypeModel.select:
        return getOptionLabel(field.name, value.toString());
      case AdminFieldTypeModel.selectMultiple:
        return Array.isArray(value)
          ? value.map((v: unknown) => getOptionLabel(field.name, v)).join(", ")
          : "-";
    }
    return value?.toString() || "-";
  }
  if (field.fieldType === AdminFieldTypeModel.objectId) {
    return (
      <IdTableCell
        key={field.name}
        id={data[field.name]}
        resourceType={field.resourceType}
      />
    );
  }
  return (
    <TableCell
      className="min-w-[100px] max-w-[500px] truncate"
      key={field.name}
    >
      {getStringValue()}
    </TableCell>
  );
}
