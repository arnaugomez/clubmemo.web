"use client";
import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/components/shadcn/ui/dialog";
import { FormResponseHandler } from "@/src/ui/view-models/server-form-errors";
import { toast } from "sonner";
import { unenrollCourseAction } from "../actions/unenroll-course-action";
import { AsyncButton } from "@/src/ui/components/button/async-button";

interface unenrollCourseDialogProps {
  course: CourseModel;
  onClose: () => void;
}

export function UnenrollCourseDialog({
  course,
  onClose,
}: unenrollCourseDialogProps) {
  async function onUnenroll() {
    try {
      const response = await unenrollCourseAction(course.id);
      const handler = new FormResponseHandler(response);
      if (!handler.hasErrors) {
        toast.success("Te has desapuntado del curso");
        onClose();
      }
      handler.toastErrors();
    } catch (error) {
      console.error(error);
      toast.error("Error al desapuntarse el curso");
    }
  }

  return (
    <Dialog open>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle className="mr-4">
            ¿Quieres desapuntarte del curso &quot;{course.name}
            &quot;?
          </DialogTitle>
          <DialogDescription>
            Perderás tu progreso y no podrás practicar con las tarjetas de
            aprendizaje.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Volver
          </Button>
          <AsyncButton onClick={onUnenroll} variant="destructive">
            Desapuntarme
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
