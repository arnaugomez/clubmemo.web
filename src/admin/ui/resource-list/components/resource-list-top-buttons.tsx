import type { AdminResourceModel } from "@/src/admin/domain/models/admin-resource-model";
import { ArrowLink } from "@/src/common/ui/components/button/arrow-link";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { translateAdminKey } from "../../i18n/admin-translations";

interface Props {
  resource: AdminResourceModel;
}
/**
 * Buttons that are displayed at the top of the resource list page. They allow
 * the user to go back to the main admin page and create a new resource.
 */
export function ResourceListTopButtons({ resource }: Props) {
  function getResourceName() {
    const translated = translateAdminKey(
      resource.resourceType,
      "singular",
      "lowercase",
    );
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
