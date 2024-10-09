import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { Card } from "@/src/common/ui/components/shadcn/ui/card";
import { Separator } from "@/src/common/ui/components/shadcn/ui/separator";
import type { NoteModel } from "@/src/notes/domain/models/note-model";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteNoteDialog } from "./delete-note-dialog";
import { EditNoteDialog } from "./edit-note-dialog";

interface CourseNoteCardProps {
  note: NoteModel;
  onDelete: () => void;
  onEdit: (note: NoteModel) => void;
}

export function CourseNoteCard({
  note,
  onDelete,
  onEdit,
}: CourseNoteCardProps) {
  return (
    <Card className="flex h-32 flex-col items-stretch overflow-clip">
      <div className="flex flex-1 items-center space-x-3 px-4">
        <h3
          className="flex-1 truncate font-medium"
          dangerouslySetInnerHTML={{
            __html: note.frontText || "Sin contenido",
          }}
        />
        <EditNoteButton note={note} onSuccess={onEdit} />

        <DeleteNoteButton note={note} onSuccess={onDelete} />
      </div>
      <Separator />
      <div className="flex flex-1 items-center px-4">
        <p
          className="flex-1 truncate"
          dangerouslySetInnerHTML={{ __html: note.backText || "Sin contenido" }}
        />
      </div>
    </Card>
  );
}

interface DeleteNoteButtonProps {
  note: NoteModel;
  onSuccess: () => void;
}

function DeleteNoteButton({ note, onSuccess }: DeleteNoteButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant="secondary"
        size="icon"
      >
        <Trash2 size={20} />
      </Button>
      {isDialogOpen && (
        <DeleteNoteDialog
          note={note}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => {
            setIsDialogOpen(false);
            onSuccess();
          }}
        />
      )}
    </>
  );
}

interface EditNoteButtonProps {
  note: NoteModel;
  onSuccess: (note: NoteModel) => void;
}

function EditNoteButton({ note, onSuccess }: EditNoteButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant="outline"
        size="icon"
      >
        <Edit2 size={20} />
      </Button>
      {isDialogOpen && (
        <EditNoteDialog
          note={note}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={(note) => {
            setIsDialogOpen(false);
            onSuccess(note);
          }}
        />
      )}
    </>
  );
}
