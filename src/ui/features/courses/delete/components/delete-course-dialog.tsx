"use client";
import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { AsyncButton } from "@/src/ui/components/button/async-button";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/components/shadcn/ui/dialog";
import { FormResponseHandler } from "@/src/ui/models/server-form-errors";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCourseAction } from "../actions/delete-course-action";

interface DeleteCourseDialogProps {
  course: CourseModel;
  onClose: () => void;
}

export function DeleteCourseDialog({
  course,
  onClose,
}: DeleteCourseDialogProps) {
  const router = useRouter();
  async function onDelete() {
    try {
      const response = await deleteCourseAction(course.id);
      const handler = new FormResponseHandler(response);
      if (!handler.hasErrors) {
        toast.success("Curso eliminado");
        router.push("/courses");
      }
      handler.toastErrors();
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el curso");
    }
  }

  return (
    <Dialog open>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle className="mr-4">
            ¿Quieres eliminar el curso &quot;{course.name}
            &quot;?
          </DialogTitle>
          <DialogDescription>
            Se eliminarán todos los datos asociados al curso, incluidas las
            tarjetas de aprendizaje.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Volver
          </Button>
          <AsyncButton onClick={onDelete} variant="destructive">
            Eliminar
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
