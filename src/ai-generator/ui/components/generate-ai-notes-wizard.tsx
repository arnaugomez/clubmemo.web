"use client";

import type { AiNotesGeneratorSourceType } from "@/src/ai-generator/domain/models/ai-notes-generator-source-type";
import type { NoteRowModel } from "@/src/notes/domain/models/note-row-model";
import { useState } from "react";
import { GenerateAiNotesForm } from "./generate-ai-notes-form";
import { GenerateAiNotesPreview } from "./generate-ai-notes-preview";
import { GenerateAiNotesSourceSelector } from "./generate-ai-notes-source-selector";

interface GenerateAiNotesWizardProps {
  courseId: string;
}

export function GenerateAiNotesWizard({
  courseId,
}: GenerateAiNotesWizardProps) {
  const [notes, setNotes] = useState<NoteRowModel[]>([]);
  const [source, setSource] = useState<AiNotesGeneratorSourceType | null>(null);
  if (!source) {
    return <GenerateAiNotesSourceSelector setSource={setSource} />;
  }
  if (!notes.length)
    return (
      <GenerateAiNotesForm
        sourceType={source}
        courseId={courseId}
        onSuccess={(notes) => setNotes(notes)}
        onGoBack={() => setSource(null)}
      />
    );
  return (
    <GenerateAiNotesPreview
      notes={notes}
      courseId={courseId}
      onRemove={(index) => {
        setNotes((prev) => prev.slice(0, index).concat(prev.slice(index + 1)));
      }}
      onCancel={() => {
        setNotes([]);
      }}
    />
  );
}
