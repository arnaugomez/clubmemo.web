import type { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import { ArrowLink } from "@/src/common/ui/components/button/arrow-link";
import { ResourceDetailDeleteButton } from "./resource-detail-delete-button";

interface Props {
  resourceType: AdminResourceTypeModel;
}
export function ResourceDetailTopButtons({ resourceType }: Props) {
  return (
    <div className="flex justify-between">
      <ArrowLink href={`/admin/resources/${resourceType}`} isLeft>
        Volver
      </ArrowLink>
      <ResourceDetailDeleteButton />
    </div>
  );
}
