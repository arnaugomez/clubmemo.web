"use client";
import { getAdminResourceByType } from "@/src/admin/domain/config/admin-resources-config";
import type { AdminResourceData } from "@/src/admin/domain/models/admin-resource-data";
import type { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import type { GetAdminResourcesUseCaseInputModel } from "@/src/admin/domain/use-cases/get-admin-resources-use-case";
import { PaginationModel } from "@/src/common/domain/models/pagination-model";
import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";
import { PaginationSection } from "@/src/common/ui/components/pagination/pagination-section";
import { Skeleton } from "@/src/common/ui/components/shadcn/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/common/ui/components/shadcn/ui/table";
import { ActionResponseHandler } from "@/src/common/ui/models/action-response-handler";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAdminResourcesAction } from "../../actions/get-admin-resources-action";
import { translateAdminKey } from "../../i18n/admin-translations";
import { ResourceListTableRow } from "./resource-list-table-row";

interface ResourceListTableProps {
  resourceType: AdminResourceTypeModel;
}

interface QueueOperation<T, U> {
  input: T;
  result?: U;
  status: "pending" | "loading" | "success" | "error";
}

type AdminQueueOperation = QueueOperation<
  GetAdminResourcesUseCaseInputModel,
  PaginationModel<AdminResourceData>
>;

export function ResourceListTable({ resourceType }: ResourceListTableProps) {
  const resource = getAdminResourceByType(resourceType);
  const params = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const previousPageRef = useRef(page);
  const pathname = usePathname();

  function getHref(page: number) {
    const newParams = new URLSearchParams(params);
    newParams.set("page", page.toString());
    return `${pathname}?${newParams.toString()}`;
  }

  const [queue, setQueue] = useState<AdminQueueOperation[]>(() => [
    {
      input: {
        resourceType: resource.resourceType,
        page: page,
        pageSize: 10,
      },
      status: "pending",
    },
  ]);

  const first = queue[0];
  const isLoading =
    !first || first.status === "loading" || first.status === "pending";
  const isError = first?.status === "error";
  const result = useMemo(() => {
    return queue.find((operation) => operation.status === "success")?.result;
  }, [queue]);

  const handleOperation = useCallback(
    async (operation: AdminQueueOperation) => {
      if (operation.status !== "pending") return;
      operation.status = "loading";
      setQueue((prev) => [...prev]);
      try {
        const response = await getAdminResourcesAction(operation.input);
        const handler = new ActionResponseHandler(response);
        if (handler.hasErrors) {
          handler.toastErrors();
          operation.status = "error";
        } else {
          if (response.data) {
            operation.result = PaginationModel.fromData(
              response.data,
              (resourceData) => resourceData,
            );
          } else {
            operation.result = PaginationModel.empty();
          }
          operation.status = "success";
        }
      } catch (e) {
        locator_common_ErrorTrackingService().captureError(e);
        operation.status = "error";
      }
      setQueue((prev) => [...prev]);
    },
    [],
  );

  useEffect(() => {
    for (const operation of queue) {
      handleOperation(operation);
    }
    const firstSuccessIndex = queue.findIndex(
      (operation) => operation.status === "success",
    );
    if (firstSuccessIndex !== -1 && firstSuccessIndex < queue.length - 1) {
      setQueue((prev) => prev.slice(0, firstSuccessIndex + 1));
    }
  }, [handleOperation, queue]);

  const loadMore = useCallback((input: GetAdminResourcesUseCaseInputModel) => {
    setQueue((prev) => [
      {
        input,
        status: "pending",
      },
      ...prev,
    ]);
  }, []);

  const handleReload = () =>
    loadMore({
      resourceType: resource.resourceType,
      page: page,
      pageSize: 10,
    });

  useEffect(() => {
    if (page !== previousPageRef.current) {
      previousPageRef.current = page;
      loadMore({
        resourceType: resource.resourceType,
        page: page,
        pageSize: 10,
      });
    }
  }, [loadMore, page, resource.resourceType]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[100px]">Identificador</TableHead>
            {resource.fields.map((field) => (
              <TableHead key={field.name} className="min-w-[100px]">
                {translateAdminKey(
                  resource.resourceType,
                  "field",
                  field.name,
                  "tableHeader",
                )}
              </TableHead>
            ))}
            <TableHead className="w-[60px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isError &&
            result?.results.map((resourceData) => (
              <ResourceListTableRow
                key={resourceData._id}
                resource={resource}
                resourceData={resourceData}
                onReload={handleReload}
              />
            ))}
        </TableBody>
      </Table>
      {isError && (
        <div className="flex h-[530px] items-center justify-center text-red-500">
          Error al cargar los datos
        </div>
      )}
      {!isError && result && !isLoading && !result.results.length && (
        <div
          className={cn(
            "flex h-[530px] items-center justify-center",
            textStyles.muted,
          )}
        >
          No hay resultados.
        </div>
      )}
      {isLoading &&
        !result?.results.length &&
        Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="mt-1 h-[49px] rounded-sm" />
        ))}
      <div className="h-8" />
      <PaginationSection
        resultsCount={result?.totalCount ?? 1}
        pageSize={10}
        page={page}
        getHref={getHref}
      />
    </>
  );
}
