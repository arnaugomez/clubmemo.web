import { adminResourcesConfig } from "@/src/admin/domain/config/admin-resources-config";
import { CreateResourcePage } from "@/src/admin/ui/create-resource/pages/create-resource-page";

export const dynamicParams = false;

export async function generateStaticParams() {
  return adminResourcesConfig.map((resource) => ({
    resourceType: resource.resourceType,
  }));
}

export default CreateResourcePage;
