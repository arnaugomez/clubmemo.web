"use client";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteResourceButton } from "../../components/delete-resource-button";
import { translateAdminKey } from "../../i18n/admin-translations";
import { useResourceDetailContext } from "../context/resource-detail-context";

export function ResourceDetailDeleteButton() {
  const { id, resourceType, data } = useResourceDetailContext();
  const { replace } = useRouter();

  return (
    <DeleteResourceButton
      disabled={!data}
      resourceType={resourceType}
      id={id}
      onDeleted={() => replace(`/admin/resources/${resourceType}`)}
    >
      <Trash2Icon className="mr-2" />
      Eliminar {translateAdminKey(resourceType, "singular")}
    </DeleteResourceButton>
  );
}
