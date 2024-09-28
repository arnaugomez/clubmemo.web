import { textStyles } from "@/src/common/ui/styles/text-styles";
import Link from "next/link";
import type { AdminResourceModel } from "../../domain/models/admin-resource-model";
import { translateAdminKey } from "../i18n/admin-translations";
import { AdminResourceIcon } from "./admin-resource-icon";

interface AdminResourceCardProps {
  resource: AdminResourceModel;
}
export function AdminResourceCard({ resource }: AdminResourceCardProps) {
  return (
    <Link
      href={`/admin/resources/${resource.resourceType}`}
      className="block rounded-lg border border-gray-200 p-4 shadow-sm hover:bg-gray-50"
    >
      <AdminResourceIcon
        adminResourceType={resource.resourceType}
        className="text-gray-500"
      />
      <div className="h-2" />
      <h4 className={textStyles.h4}>
        {translateAdminKey(resource.resourceType, "label")}
      </h4>
      <div className="h-1" />
      <p className={textStyles.muted}>
        {translateAdminKey(resource.resourceType, "description")}
      </p>
    </Link>
  );
}