import { NoteRowModel } from "@/src/core/notes/domain/models/note-row-model";

interface GenerateAiNotesPreviewProps {
  notes: NoteRowModel[];
  onSubmit: () => void;
  onCancel: () => void;
}
export function GenerateAiNotesPreview({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSubmit,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCancel,
}: GenerateAiNotesPreviewProps) {
  return <></>;
}
