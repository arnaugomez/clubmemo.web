"use client";

import type { PaginationModelData } from "@/src/common/domain/models/pagination-model";
import { PaginationModel } from "@/src/common/domain/models/pagination-model";
import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import { Skeleton } from "@/src/common/ui/components/shadcn/ui/skeleton";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { NoteModelData } from "@/src/notes/domain/models/note-model";
import { NoteModel } from "@/src/notes/domain/models/note-model";
import { Layers } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { paginateNotesAction } from "../actions/paginate-notes-action";
import { useCourseNotesContext } from "../contexts/course-notes-context";
import { CourseNoteCard } from "./course-note-card";
import { CourseNotesEmptyState } from "./course-notes-empty-state";

interface CourseNotesResultsSectionProps {
  courseId: string;
  initialData: PaginationModelData<NoteModelData>;
}

export function CourseNotesResultsSection({
  courseId,
  initialData,
}: CourseNotesResultsSectionProps) {
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

    setIsLoading(false);
  }, [canLoadMore, contextResults, courseId, isLoading, setContextResults]);

  useEffect(() => {
    if (!inView) return;
    loadMore();
  }, [inView, loadMore]);

  if (!results.length) {
    return <CourseNotesEmptyState courseId={courseId} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {results.map((note) => (
          <CourseNoteCard
            note={note}
            key={note.id}
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
        {canLoadMore && (
          <div key="inView" ref={ref}>
            <Skeleton key="inView" className="h-32 rounded-lg bg-slate-200" />
          </div>
        )}
        {canLoadMore &&
          Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg bg-slate-200" />
          ))}
      </div>
      {!canLoadMore && (
        <>
          <div className="flex justify-center pt-16">
            <Layers className={cn(textStyles.muted, "size-5")} />
          </div>
          <div className="h-4"></div>
          <p className={cn(textStyles.muted, "text-center text-sm")}>
            No hay más tarjetas
          </p>
        </>
      )}
    </>
  );
}
