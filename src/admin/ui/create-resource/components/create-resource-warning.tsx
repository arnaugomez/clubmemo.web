import type { AdminResourceModel } from "@/src/admin/domain/models/admin-resource-model";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/common/ui/components/shadcn/ui/alert";
import { TriangleAlert } from "lucide-react";
import { translateAdminKey } from "../../i18n/admin-translations";

interface CreateResourceWarningProps {
  resource: AdminResourceModel;
}

/**
 * Custom alert to show when the user is about to create a resource.
 */
export function CreateResourceAlert({ resource }: CreateResourceWarningProps) {
  return (
    <Alert>
      <TriangleAlert size={16} />
      <AlertTitle>
        {translateAdminKey(resource.resourceType, "createAlert", "title")}
      </AlertTitle>
      <AlertDescription>
        {translateAdminKey(resource.resourceType, "createAlert", "description")}
      </AlertDescription>
    </Alert>
  );
}
