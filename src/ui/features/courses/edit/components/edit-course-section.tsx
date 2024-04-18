"use client";

import {
  CourseModel,
  CourseModelData,
} from "@/src/core/courses/domain/models/course-model";
import {
  FileFormField,
  InputFormField,
  SwitchSectionFormField,
  TagsFormField,
  TextareaFormField,
} from "@/src/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/ui/components/form/form-global-error-message";
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
import { FormResponseHandler } from "@/src/ui/models/server-form-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2 } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { editCourseUploadAction } from "../../../course/edit/actions/edit-course-upload-action";
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
        <Edit2 className="mr-3 size-4" /> Editar
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
  tags: z.array(z.string().trim().min(1).max(50)).max(10),
  picture: z.string().or(z.instanceof(File)).optional(),
});

type FormValues = z.infer<typeof EditCourseSchema>;

function EditCourseDialog({ course, onClose }: EditCourseDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(EditCourseSchema),
    defaultValues: {
      name: course.name ?? "",
      description: course.description ?? "",
      isPublic: course.isPublic,
      tags: course.tags,
      picture: course.picture,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const uploadActionResponse = await editCourseUploadAction({
      courseId: course.id,
      pictureContentType: data.picture instanceof File ? data.picture.type : "",
      uploadPicture: data.picture instanceof File,
    });
    const uploadActionHandler = new FormResponseHandler(
      uploadActionResponse,
      form,
    );
    if (uploadActionHandler.hasErrors) {
      uploadActionHandler.setErrors();
      return;
    }
    if (uploadActionHandler.data) {
      if (uploadActionHandler.data.picture && data.picture instanceof File) {
        const { url, fields } = uploadActionHandler.data.picture;

        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        formData.append("file", data.picture);

        const uploadResponse = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.ok) {
          data.picture = url + fields.key;
        }
      }
    }

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
        <FormProvider {...form}>
          <form className="min-w-0" onSubmit={onSubmit}>
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
              <TagsFormField
                label="Etiquetas del curso"
                name="tags"
                placeholder="Sus temas, asignaturas..."
              />
              <div className="h-4" />
              <SwitchSectionFormField
                name="isPublic"
                label="Curso público"
                description="Haz que el curso sea visible para otros usuarios"
              />
              <div className="h-4" />
              <FileFormField
                label="Imagen del curso"
                name="picture"
                accept={{
                  "image/png": [".png"],
                  "image/jpeg": [".jpeg", ".jpg"],
                }}
                isImage
                maxSize={5 * 1024 * 1024}
              />
              <FormGlobalErrorMessage />
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
