"use client";
import type { AdminResourceData } from "@/src/admin/domain/models/admin-resource-data";
import { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";
import { ActionResponseHandler } from "@/src/common/ui/models/action-response-handler";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAdminResourceDetailAction } from "../../actions/get-admin-resource-detail-action";

interface ResourceDetailContextValue {
  data: AdminResourceData | null;
  resourceType: AdminResourceTypeModel;
  id: string;
  isNotFound: boolean;
  isLoading: boolean;
  hasError: boolean;
}
const ResourceDetailContext = createContext<ResourceDetailContextValue>({
  data: null,
  resourceType: AdminResourceTypeModel.users,
  id: "",
  isNotFound: false,
  isLoading: true,
  hasError: false,
});

export function ResourceDetailContextProvider({
  children,
  resourceType,
  id,
}: {
  children: React.ReactNode;
  resourceType: AdminResourceTypeModel;
  id: string;
}) {
  const [data, setData] = useState<AdminResourceData | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAdminResourceDetailAction({
        resourceType,
        id,
      });
      const handler = new ActionResponseHandler(response);
      if (handler.hasErrors) {
        handler.toastErrors();
        setHasError(true);
      } else if (handler.data) {
        setData(handler.data);
      } else {
        setIsNotFound(true);
      }
    } catch (error) {
      locator_common_ErrorTrackingService().captureError(error);
      setHasError(true);
    }
    setIsLoading(false);
  }, [id, resourceType]);

  useEffect(() => {
    fetchData();
  }, [resourceType, id, fetchData]);

  return (
    <ResourceDetailContext.Provider
      value={{
        data,
        resourceType,
        id,
        isNotFound,
        isLoading,
        hasError,
      }}
    >
      {children}
    </ResourceDetailContext.Provider>
  );
}

export function useResourceDetailContext() {
  return useContext(ResourceDetailContext);
}
