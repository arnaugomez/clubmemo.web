import type { AdminResourceTypeModel } from "../../domain/models/admin-resource-model";

export interface PropsWithResourceTypeParam {
  params: {
    resourceType: AdminResourceTypeModel;
  };
}
