"use client";

import {
  PaginationModel,
  PaginationModelData,
} from "@/src/core/app/domain/models/pagination-model";
import { waitMilliseconds } from "@/src/core/app/utils/promises";
import {
  NoteModel,
  NoteModelData,
} from "@/src/core/notes/domain/models/note-model";
import { Card } from "@/src/ui/components/shadcn/ui/card";
import { Separator } from "@/src/ui/components/shadcn/ui/separator";
import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";
import { FormResponseHandler } from "@/src/ui/models/server-form-errors";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { paginateNotesAction } from "../actions/paginate-notes-action";
import { useCourseNotesContext } from "../contexts/course-notes-context";

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

  const results = contextResults.length
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
      page: Math.floor(contextResults.length / 10),
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

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {results.map((note) => (
          <CourseNoteCard note={note} key={note.id} />
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
            <Search className={cn(textStyles.muted, "size-5")} />
          </div>
          <div className="h-4"></div>
          <p className={cn(textStyles.muted, "text-center text-sm")}>
            No hay más resultados
          </p>
        </>
      )}
    </>
  );
}

interface CourseNoteCardProps {
  note: NoteModel;
}

function CourseNoteCard({ note }: CourseNoteCardProps) {
  return (
    <Card className="h-32 flex flex-col items-stretch overflow-clip">
      <div className="flex-1 flex items-center px-4">
        <h3 className="truncate font-medium">{note.front}</h3>
      </div>
      <Separator />
      <div className="flex-1 flex items-center px-4">
        <p className="truncate flex-1">{note.back || "Tarjeta sin "}</p>
      </div>
    </Card>
  );
}
