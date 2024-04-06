"use client";

import { NoteRowModel } from "@/src/core/notes/domain/models/note-row-model";
import { useState } from "react";
import { GenerateAiNotesForm } from "./generate-ai-notes-form";
import { GenerateAiNotesPreview } from "./generate-ai-notes-preview";

interface GenerateAiNotesWizardProps {
  courseId: string;
}

export function GenerateAiNotesWizard({
  courseId,
}: GenerateAiNotesWizardProps) {
  const [notes, setNotes] = useState<NoteRowModel[]>([]);
  if (!notes.length)
    return (
      <GenerateAiNotesForm
        courseId={courseId}
        onSuccess={(notes) => setNotes(notes)}
      />
    );
  return (
    <GenerateAiNotesPreview
      notes={notes}
      onSubmit={() => {
        console.log("submit");
      }}
      onCancel={() => {
        setNotes([]);
      }}
    />
  );
}
