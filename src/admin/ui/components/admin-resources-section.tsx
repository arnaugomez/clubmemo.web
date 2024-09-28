import { textStyles } from "@/src/common/ui/styles/text-styles";
import { adminResourcesConfig } from "../../domain/config/admin-resources-config";
import { AdminResourceCard } from "./admin-resource-card";

export function AdminResourcesSection() {
  return (
    <div className="px-4">
      <div className="mx-auto max-w-screen-lg">
        <h2 className={textStyles.h3}>Gestión de recursos</h2>
        <div className="h-3" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {adminResourcesConfig.map((resource) => (
            <AdminResourceCard key={resource.type} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  );
}
