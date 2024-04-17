import { NoteModel } from "@/src/core/notes/domain/models/note-model";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Card } from "@/src/ui/components/shadcn/ui/card";
import { Separator } from "@/src/ui/components/shadcn/ui/separator";
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
    <Card className="h-32 flex flex-col items-stretch overflow-clip">
      <div className="flex-1 flex items-center px-4 space-x-3">
        <h3 className="flex-1 truncate font-medium">{note.frontText}</h3>
        <EditNoteButton note={note} onSuccess={onEdit} />

        <DeleteNoteButton note={note} onSuccess={onDelete} />
      </div>
      <Separator />
      <div className="flex-1 flex items-center px-4">
        <p className="truncate flex-1">{note.backText || "Sin contenido"}</p>
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
