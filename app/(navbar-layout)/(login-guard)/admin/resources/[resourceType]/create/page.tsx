import { adminResourcesConfig } from "@/src/admin/domain/config/admin-resources-config";

export async function generateStaticParams() {
  return adminResourcesConfig.map((resource) => ({
    resourceType: resource.resourceType,
  }));
}
