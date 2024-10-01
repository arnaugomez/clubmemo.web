"use client";
import { useRouter } from "next/navigation";
import { translateAdminKey } from "../../i18n/admin-translations";
import { useResourceDetailContext } from "../context/resource-detail-context";
import { DeleteResourceButton } from "../../components/delete-resource-button";

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
      Eliminar {translateAdminKey(resourceType, "singular")}
    </DeleteResourceButton>
  );
}
