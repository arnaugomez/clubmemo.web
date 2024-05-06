import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/common/ui/components/shadcn/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/common/ui/components/shadcn/ui/tabs";
import type { NoteModel } from "@/src/notes/domain/models/note-model";
import { useState } from "react";
import { ImportNotesAnkiForm } from "./import-notes-anki-form";
import { ImportNotesCsvForm } from "./import-notes-csv-form";
import { ImportNotesJsonForm } from "./import-notes-json-form";

interface ImportNotesDialogProps {
  courseId: string;
  onClose: () => void;
  onSuccess: (notes: NoteModel[]) => void;
}

export function ImportNotesDialog({
  courseId,
  onClose,
  onSuccess,
}: ImportNotesDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Dialog open>
      <DialogContent onClose={isLoading ? undefined : onClose}>
        <DialogHeader>
          <DialogTitle>Importar archivo</DialogTitle>
          <DialogDescription>
            Sube un archivo con tarjetas para añadirlas a este curso.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="csv" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="flex-1" disabled={isLoading} value="csv">
              CSV
            </TabsTrigger>
            <TabsTrigger className="flex-1" disabled={isLoading} value="json">
              JSON
            </TabsTrigger>
            <TabsTrigger className="flex-1" disabled={isLoading} value="anki">
              Anki
            </TabsTrigger>
          </TabsList>
          <TabsContent value="csv">
            <ImportNotesCsvForm
              courseId={courseId}
              setIsLoading={() => setIsLoading(true)}
              onClose={onClose}
              onSuccess={onSuccess}
            />
          </TabsContent>
          <TabsContent value="json">
            <ImportNotesJsonForm
              courseId={courseId}
              setIsLoading={() => setIsLoading(true)}
              onClose={onClose}
              onSuccess={onSuccess}
            />
          </TabsContent>
          <TabsContent value="anki">
            <ImportNotesAnkiForm
              courseId={courseId}
              setIsLoading={() => setIsLoading(true)}
              onClose={onClose}
              onSuccess={onSuccess}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
