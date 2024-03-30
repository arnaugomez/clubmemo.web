"use client";

import {
  CourseModel,
  CourseModelData,
} from "@/src/core/courses/domain/models/course-model";
import {
  InputFormField,
  SwitchSectionFormField,
  TextareaFormField,
} from "@/src/ui/components/form/form-fields";
import { FormSubmitButton } from "@/src/ui/components/form/form-submit-button";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/components/shadcn/ui/dialog";
import { Form } from "@/src/ui/components/shadcn/ui/form";
import { FormResponseHandler } from "@/src/ui/view-models/server-form-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { editCourseAction } from "../actions/edit-course-action";

interface CourseDetailEditSectionProps {
  courseData: CourseModelData;
}

export function CourseDetailEditSection({
  courseData,
}: CourseDetailEditSectionProps) {
  const course = new CourseModel(courseData);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        Editar
      </Button>
      {isOpen && (
        <EditCourseDialog onClose={() => setIsOpen(false)} course={course} />
      )}
    </>
  );
}
interface EditCourseDialogProps {
  course: CourseModel;
  onClose: () => void;
}

const EditCourseSchema = z.object({
  name: z.string().trim().min(1).max(50),
  description: z.string().trim().min(0).max(255),
  isPublic: z.boolean(),
});

type FormValues = z.infer<typeof EditCourseSchema>;

function EditCourseDialog({ course, onClose }: EditCourseDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(EditCourseSchema),
    defaultValues: {
      name: course.name ?? "",
      description: course.description ?? "",
      isPublic: course.isPublic,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await editCourseAction({ id: course.id, ...data });
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) {
        toast.success("El curso ha sido actualizado");
        onClose();
      }
      handler.setErrors();
    } catch (error) {
      console.error(error);
      FormResponseHandler.setGlobalError(form);
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open>
      <DialogContent onClose={isSubmitting ? undefined : onClose}>
        <DialogHeader>
          <DialogTitle>Editar curso</DialogTitle>
          <DialogDescription>
            Modifica los datos del curso para personalizar tu experiencia y
            hacer que otros usuarios puedan encontrarlo y conocerlo mejor.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <InputFormField
                label="Nombre del curso"
                name="name"
                placeholder={
                  'El nombre del curso, por ejemplo, "Matemáticas 1"'
                }
              />
              <div className="h-4" />
              <TextareaFormField
                label="Descripción"
                name="description"
                placeholder="De qué trata el curso"
              />
              <div className="h-4" />
              <SwitchSectionFormField
                name="isPublic"
                label="Curso público"
                description="Haz que el curso sea visible para otros usuarios"
              />
            </div>
            <div className="h-6" />
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={onClose}
              >
                Volver
              </Button>
              <FormSubmitButton>Enviar</FormSubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
