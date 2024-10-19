import type { AdminResourceTypeModel } from "../../domain/models/admin-resource-model";

/**
 * Props of a Next.js page component with the resourceType path param
 */
export interface PropsWithResourceTypeParam {
  params: {
    resourceType: AdminResourceTypeModel;
  };
}
