import type { AdminResourceModel } from "@/src/admin/domain/models/admin-resource-model";
import { ArrowLink } from "@/src/common/ui/components/button/arrow-link";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { translateAdminKey } from "../../i18n/admin-translations";

interface Props {
  resource: AdminResourceModel;
}
export function ResourceListTopButtons({ resource }: Props) {
  function getResourceName() {
    const translated = translateAdminKey(resource.resourceType, "singular");
    if (translated.length > 10) {
      return translated.slice(0, 20) + "...";
    }
  }
  return (
    <div className="flex h-10 items-center justify-between">
      <ArrowLink href="/admin" isLeft>
        Volver
      </ArrowLink>
      {!resource.cannotCreate && (
        <Button variant="secondary" asChild>
          <Link href={`/admin/resources/${resource.resourceType}/create`}>
            <PlusIcon className="mr-2" />
            Crear {getResourceName()}
          </Link>
        </Button>
      )}
    </div>
  );
}
