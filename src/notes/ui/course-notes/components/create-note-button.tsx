"use client";
import type {
  ButtonProps} from "@/src/common/ui/components/shadcn/ui/button";
import {
  Button
} from "@/src/common/ui/components/shadcn/ui/button";
import type { NoteModel } from "@/src/notes/domain/models/note-model";
import { useState } from "react";
import { useCourseNotesContext } from "../contexts/course-notes-context";
import { CreateNoteDialog } from "./create-note-dialog";

interface CreateNoteButtonProps extends ButtonProps {
  courseId: string;
}
export function CreateNoteButton({
  courseId,
  children,
  ...rest
}: CreateNoteButtonProps) {
  const [, setNotes] = useCourseNotesContext();
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button {...rest} onClick={() => setShowDialog(true)}>
        {children || "Añadir"}
      </Button>
      {showDialog && (
        <CreateNoteDialog
          courseId={courseId}
          onClose={() => setShowDialog(false)}
          onSuccess={function (note: NoteModel): void {
            setNotes((notes) => [note, ...notes]);
            setShowDialog(false);
          }}
        />
      )}
    </>
  );
}
