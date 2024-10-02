"use client";

import { z } from "@/i18n/zod";
import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";
import { FileSchema } from "@/src/common/schemas/file-schema";
import { FileFormField } from "@/src/common/ui/components/form/file-form-field";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { InputFormField } from "@/src/common/ui/components/form/input-form-field";
import { SwitchSectionFormField } from "@/src/common/ui/components/form/switch-section-form-field";
import { TagsFormField } from "@/src/common/ui/components/form/tags-form-field";
import { TextareaFormField } from "@/src/common/ui/components/form/textarea-form-field";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/common/ui/components/shadcn/ui/dialog";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import type { CourseModelData } from "@/src/courses/domain/models/course-model";
import { CourseModel } from "@/src/courses/domain/models/course-model";
import { clientFileUploadLocator } from "@/src/file-upload/client-file-upload-locator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2 } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { editCourseAction } from "../actions/edit-course-action";
import { editCourseUploadAction } from "../actions/edit-course-upload-action";
import { TagsSchema } from "@/src/tags/domain/schemas/tags-schema";

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
  tags: TagsSchema,
  picture: z.string().or(FileSchema).optional(),
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
    try {
      const uploadActionResponse = await editCourseUploadAction({
        courseId: course.id,
        pictureContentType:
          data.picture instanceof File ? data.picture.type : "",
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
          const fileUploadService =
            await clientFileUploadLocator.ClientFileUploadService();
          await fileUploadService.uploadPresignedUrl({
            file: data.picture,
            presignedUrl: uploadActionHandler.data.picture.presignedUrl,
          });
          data.picture = uploadActionHandler.data.picture.url;
        }
      }
    } catch (e) {
      locator_common_ErrorTrackingService().captureError(e);
      toast.error("Error al subir la imagen");
      return;
    }

    try {
      const response = await editCourseAction({
        id: course.id,
        description: data.description,
        isPublic: data.isPublic,
        name: data.name,
        picture: typeof data.picture === "string" ? data.picture : undefined,
        tags: data.tags,
      });

      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) {
        toast.success("El curso ha sido actualizado");
        onClose();
      }
      handler.setErrors();
    } catch (e) {
      locator_common_ErrorTrackingService().captureError(e);
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
