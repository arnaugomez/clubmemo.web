"use client";

import type { PaginationModelData } from "@/src/common/domain/models/pagination-model";
import { PaginationModel } from "@/src/common/domain/models/pagination-model";
import { waitMilliseconds } from "@/src/common/domain/utils/promise";
import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";
import { PaginationEmptyState } from "@/src/common/ui/components/empty-state/pagination-empty-state";
import { Skeleton } from "@/src/common/ui/components/shadcn/ui/skeleton";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { NoteModelData } from "@/src/notes/domain/models/note-model";
import { NoteModel } from "@/src/notes/domain/models/note-model";
import range from "lodash/range";
import { Layers } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { paginateNotesAction } from "../actions/paginate-notes-action";
import { useCourseNotesContext } from "../contexts/course-notes-context";
import { CourseNoteCard } from "./course-note-card";
import { CourseNotesEmptyState } from "./course-notes-empty-state";

interface CourseNotesLoadedProps {
  courseId: string;
  initialData: PaginationModelData<NoteModelData>;
  canEdit: boolean;
}

export function CourseNotesLoaded({
  courseId,
  initialData,
  canEdit,
}: CourseNotesLoadedProps) {
  const initialPagination = useMemo(
    () => PaginationModel.fromData(initialData, (e) => new NoteModel(e)),
    [initialData],
  );

  const hasSetInitialResults = useRef(false);
  const [contextResults, setContextResults] = useCourseNotesContext();
  const [isLoading, setIsLoading] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(
    initialPagination.results.length < initialPagination.totalCount,
  );
  const { ref, inView } = useInView();

  useEffect(() => {
    if (hasSetInitialResults.current) return;
    setContextResults((value) => value.concat(initialPagination.results));
    hasSetInitialResults.current = true;
  }, [initialPagination.results, setContextResults]);

  const results =
    hasSetInitialResults.current || contextResults.length
      ? contextResults
      : initialPagination.results;

  const loadMore = useCallback(async () => {
    if (!canLoadMore) return;

    if (isLoading) return;
    setIsLoading(true);

    while (!hasSetInitialResults.current) {
      await waitMilliseconds(1000);
    }

    try {
      const result = await paginateNotesAction({
        courseId,
        page: Math.floor(contextResults.length / 10) + 1,
      });
      const handler = new FormResponseHandler(result);

      if (handler.hasErrors) {
        handler.toastErrors();
        await waitMilliseconds(1500);
      } else if (handler.data) {
        const pagination = PaginationModel.fromData(
          handler.data,
          (e) => new NoteModel(e),
        );
        const newResults = contextResults.concat(pagination.results);
        setContextResults(newResults);
        setCanLoadMore(newResults.length < pagination.totalCount);
      }
    } catch (error) {
      locator_common_ErrorTrackingService().captureError(error);
      toast.error("Error al cargar tarjetas");
      await waitMilliseconds(1500);
    }

    setIsLoading(false);
  }, [canLoadMore, contextResults, courseId, isLoading, setContextResults]);

  useEffect(() => {
    if (!inView) return;
    loadMore();
  }, [inView, loadMore]);

  if (!results.length && canEdit) {
    return <CourseNotesEmptyState courseId={courseId} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {results.map((note) => (
          <CourseNoteCard
            note={note}
            key={note.id}
            canEdit={canEdit}
            onDelete={() => {
              setContextResults((notes) =>
                notes.filter((n) => n.id !== note.id),
              );
            }}
            onEdit={(editedNote) => {
              setContextResults((notes) =>
                notes.map((n) => (n.id === editedNote.id ? editedNote : n)),
              );
            }}
          />
        ))}
        {canLoadMore &&
          range(3).map((_, i) => (
            <Skeleton
              key={i}
              ref={i ? undefined : ref}
              className="h-32 rounded-lg bg-slate-200"
            />
          ))}
      </div>
      {!canLoadMore && (
        <PaginationEmptyState
          icon={<Layers className={cn(textStyles.muted, "size-5")} />}
          title="No hay más tarjetas"
        />
      )}
    </>
  );
}
