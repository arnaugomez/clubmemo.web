"use client";

import { ButtonProps } from "@/src/ui/components/shadcn/ui/button";
import { useCourseNotesContext } from "../contexts/course-notes-context";
import { CreateNoteButton } from "./create-note-button";

interface CourseNotesCreateNoteButtonProps extends ButtonProps {
  courseId: string;
}

export function CourseNotesCreateNoteButton({
  courseId,
  children,
  ...rest
}: CourseNotesCreateNoteButtonProps) {
  const [, setNotes] = useCourseNotesContext();
  return (
    <CreateNoteButton
      {...rest}
      courseId={courseId}
      onCreate={(note) => setNotes((notes) => [note, ...notes])}
    >
      {children}
    </CreateNoteButton>
  );
}
