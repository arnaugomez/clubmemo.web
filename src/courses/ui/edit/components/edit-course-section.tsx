"use client";
import * as Schema from "effect/Schema";
import * as SchemaGetter from "effect/SchemaGetter";
import { Edit2 } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { captureError, runClient } from "@/src/common/effect/client-runtime";
import { schemaResolver } from "@/src/common/effect/schema-resolver";
import { OptionalFileFieldSchema } from "@/src/common/schemas/file-schema";
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
import { uploadFileWorkflow } from "@/src/file-upload/ui/workflows/upload-file";
import { TagsSchema } from "@/src/tags/domain/schemas/tags-schema";
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

const EditCourseSchema = Schema.Struct({
  name: Schema.String.pipe(
    Schema.decode({
      decode: SchemaGetter.transform((value) => value.trim()),
      encode: SchemaGetter.passthrough(),
    }),
  )
    .check(
      Schema.isMinLength(1, {
        message: `El texto debe contener al menos ${1} carácter(es)`,
      }),
    )
    .check(
      Schema.isMaxLength(50, {
        message: `El texto debe contener como máximo ${50} carácter(es)`,
      }),
    ),
  description: Schema.String.pipe(
    Schema.decode({
      decode: SchemaGetter.transform((value) => value.trim()),
      encode: SchemaGetter.passthrough(),
    }),
  )
    .check(
      Schema.isMinLength(0, {
        message: `El texto debe contener al menos ${0} carácter(es)`,
      }),
    )
    .check(
      Schema.isMaxLength(255, {
        message: `El texto debe contener como máximo ${255} carácter(es)`,
      }),
    ),
  isPublic: Schema.Boolean,
  tags: TagsSchema,
  picture: Schema.mutableKey(OptionalFileFieldSchema),
});

type FormValues = (typeof EditCourseSchema)["Type"];

function EditCourseDialog({ course, onClose }: EditCourseDialogProps) {
  const form = useForm<FormValues>({
    resolver: schemaResolver(EditCourseSchema),
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
      if (data.picture instanceof File) {
        const response = await runClient(
          uploadFileWorkflow({
            collection: "profiles",
            field: "picture",
            file: data.picture,
          }),
        );
        const handler = new FormResponseHandler(response, form);
        if (handler.hasErrors) {
          handler.setErrors();
          return;
        } else if (handler.data) {
          data.picture = handler.data.url;
        }
      }
    } catch (error) {
      captureError(error);
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
      captureError(e);
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
