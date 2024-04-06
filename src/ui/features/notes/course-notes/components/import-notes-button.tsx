"use client";

import { Button } from "@/src/ui/components/shadcn/ui/button";
import { useState } from "react";
import { useCourseNotesContext } from "../contexts/course-notes-context";
import { ImportNotesDialog } from "./import-notes-dialog";

interface ImportNotesButtonProps {
  courseId: string;
}

export function ImportNotesButton({ courseId }: ImportNotesButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, setCourseNotes] = useCourseNotesContext();
  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="w-full sm:max-w-sm sm:mx-auto"
      >
        Empezar
      </Button>
      {isDialogOpen && (
        <ImportNotesDialog
          courseId={courseId}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={(notes) => {
            setCourseNotes((v) => notes.concat(v));
            setIsDialogOpen(false);
          }}
        />
      )}
    </>
  );
}
