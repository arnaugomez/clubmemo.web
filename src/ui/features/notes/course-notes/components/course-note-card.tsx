import { NoteModel } from "@/src/core/notes/domain/models/note-model";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Card } from "@/src/ui/components/shadcn/ui/card";
import { Separator } from "@/src/ui/components/shadcn/ui/separator";
import { Edit2, Trash2 } from "lucide-react";

interface CourseNoteCardProps {
  note: NoteModel;
}

export function CourseNoteCard({ note }: CourseNoteCardProps) {
  return (
    <Card className="h-32 flex flex-col items-stretch overflow-clip">
      <div className="flex-1 flex items-center px-4 space-x-3">
        <h3 className="flex-1 truncate font-medium">{note.front}</h3>
        <Button variant="outline" size="icon">
          <Edit2 size={20} />
        </Button>
        <Button variant="secondary" size="icon">
          <Trash2 size={20} />
        </Button>
      </div>
      <Separator />
      <div className="flex-1 flex items-center px-4">
        <p className="truncate flex-1">{note.back || "Tarjeta sin "}</p>
      </div>
    </Card>
  );
}
