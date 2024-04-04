"use client";
import { NoteModel } from "@/src/core/notes/domain/models/note-model";
import { Button, ButtonProps } from "@/src/ui/components/shadcn/ui/button";
import { useState } from "react";
import { CreateNoteDialog } from "./create-note-dialog";

interface CreateNoteButtonProps extends ButtonProps {
  courseId: string;
  onCreate: (note: NoteModel) => void;
}
export function CreateNoteButton({
  courseId,
  onCreate,
  children,
  ...rest
}: CreateNoteButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button {...rest} onClick={() => setShowDialog(true)}>
        {children || "Nueva tarjeta"}
      </Button>
      {showDialog && (
        <CreateNoteDialog
          courseId={courseId}
          onClose={() => setShowDialog(false)}
          onSuccess={function (note: NoteModel): void {
            onCreate(note);
            setShowDialog(false);
          }}
        />
      )}
    </>
  );
}
