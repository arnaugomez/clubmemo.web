import { adminResourcesConfig } from "@/src/admin/domain/config/admin-resources-config";
import { ResourceListPage } from "@/src/admin/ui/resource-list/pages/resource-list-page";

export async function generateStaticParams() {
  return adminResourcesConfig.map((resource) => ({
    resourceType: resource.resourceType,
  }));
}

export default ResourceListPage;
