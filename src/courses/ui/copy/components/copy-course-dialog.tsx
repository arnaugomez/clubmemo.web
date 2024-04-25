"use client";
import { AsyncButton } from "@/src/common/ui/components/button/async-button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/common/ui/components/shadcn/ui/alert";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/common/ui/components/shadcn/ui/dialog";
import { ActionResponseHandler } from "@/src/common/ui/models/action-response-handler";
import { CourseModel } from "@/src/courses/domain/models/course-model";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { copyCourseAction } from "../actions/copy-course-action";

interface CopyCourseDialogProps {
  course: CourseModel;
  onClose: () => void;
}

export function CopyCourseDialog({ course, onClose }: CopyCourseDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function onCopy() {
    setIsLoading(true);
    try {
      const response = await copyCourseAction({ courseId: course.id });
      const handler = new ActionResponseHandler(response);
      if (!handler.hasErrors && handler.data) {
        toast.success("Curso copiado");
        router.push("/courses/detail/" + handler.data.id);
      }
      handler.toastErrors();
    } catch (error) {
      console.error(error);
      toast.error("Error al copiar el curso");
    }
    setIsLoading(false);
  }

  return (
    <Dialog open>
      <DialogContent onClose={isLoading ? undefined : onClose}>
        <DialogHeader>
          <DialogTitle className="mr-4">
            ¿Quieres copiar el curso &quot;{course.name}
            &quot;?
          </DialogTitle>
          <DialogDescription>
            Se hará una copia de este curso y de todas sus tarjetas.
          </DialogDescription>
          <div className="h-4"></div>
          <Alert>
            <TriangleAlert size={16} />
            <AlertTitle>La copia y el original son independientes</AlertTitle>
            <AlertDescription>
              Podrás editar la copia sin modificar el original. Asimismo, los
              cambios que se hagan posteriormente en el curso original no se
              reflejarán en la copia.
            </AlertDescription>
          </Alert>
          <div className="h-4"></div>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={isLoading}
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Volver
          </Button>
          <AsyncButton onClick={onCopy}>
            {isLoading ? "Copiando..." : "Iniciar copia"}
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
