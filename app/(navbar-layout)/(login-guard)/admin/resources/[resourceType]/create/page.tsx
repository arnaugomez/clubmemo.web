import { adminResourcesConfig } from "@/src/admin/domain/config/admin-resources-config";
import { CreateResourcePage } from "@/src/admin/ui/create-resource/pages/create-resource-page";

/**
 * If the browser visits a URL that does not match the defined
 * values of the `resourceType` route segment, it will show a 404 page
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
 */
export const dynamicParams = false;

/**
 * Generates the possible values of the `resourceType` route segment
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  return adminResourcesConfig.map((resource) => ({
    resourceType: resource.resourceType,
  }));
}

export default CreateResourcePage;
