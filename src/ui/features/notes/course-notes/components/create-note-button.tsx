"use client";
import { NoteModel } from "@/src/core/notes/domain/models/note-model";
import { Button, ButtonProps } from "@/src/ui/components/shadcn/ui/button";
import { useState } from "react";
import { CreateNoteDialog } from "./create-note-dialog";
import { useCourseNotesContext } from "../contexts/course-notes-context";

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
