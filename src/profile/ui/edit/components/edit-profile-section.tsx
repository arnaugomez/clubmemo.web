"use client";
import * as Schema from "effect/Schema";
import * as SchemaGetter from "effect/SchemaGetter";
import { Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { captureError, runClient } from "@/src/common/effect/client-runtime";
import { schemaResolver } from "@/src/common/effect/schema-resolver";
import { OptionalFileFieldSchema } from "@/src/common/schemas/file-schema";
import { HandleSchema } from "@/src/common/schemas/handle-schema";
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
import { uploadFileWorkflow } from "@/src/file-upload/ui/workflows/upload-file";
import type { ProfileModelData } from "@/src/profile/domain/models/profile-model";
import { ProfileModel } from "@/src/profile/domain/models/profile-model";
import { TagsSchema } from "@/src/tags/domain/schemas/tags-schema";
import { editProfileAction } from "../actions/edit-profile-action";

interface EditProfileSectionProps {
  profileData: ProfileModelData;
}

/**
 * Shows a button to edit the profile and opens a dialog when the button is pressed
 */
export function EditProfileSection({ profileData }: EditProfileSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const profile = new ProfileModel(profileData);
  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="secondary">
        <Edit2 className="mr-3 size-4" /> Editar
      </Button>
      {isOpen && (
        <EditProfileDialog onClose={() => setIsOpen(false)} profile={profile} />
      )}
    </>
  );
}

interface EditProfileDialogProps {
  profile: ProfileModel;
  onClose: () => void;
}

/**
 * Validation rules for the edit profile form
 */
const EditProfileSchema = Schema.Struct({
  displayName: Schema.String.pipe(
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
  handle: HandleSchema,
  bio: Schema.String.pipe(
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
  website: Schema.Union([
    Schema.String.check(
      Schema.makeFilter(
        (value) => {
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        },
        { message: "Enlace inválido" },
      ),
    ).check(
      Schema.isMaxLength(2083, {
        message: `El texto debe contener como máximo ${2083} carácter(es)`,
      }),
    ),
    Schema.String.check(
      Schema.isMaxLength(0, {
        message: `El texto debe contener como máximo ${0} carácter(es)`,
      }),
    ),
  ]),
  isPublic: Schema.Boolean,
  tags: TagsSchema,
  picture: Schema.mutableKey(OptionalFileFieldSchema),
  backgroundPicture: Schema.mutableKey(OptionalFileFieldSchema),
});

type FormValues = (typeof EditProfileSchema)["Type"];

/**
 * Dialog with a form to edit the profile
 */
function EditProfileDialog({ profile, onClose }: EditProfileDialogProps) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: schemaResolver(EditProfileSchema),
    defaultValues: {
      displayName: profile.displayName ?? "",
      handle: profile.handle ?? "",
      bio: profile.bio ?? "",
      website: profile.website ?? "",
      isPublic: profile.isPublic,
      tags: profile.tags,
      picture: profile.picture,
      backgroundPicture: profile.backgroundPicture,
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
      if (data.backgroundPicture instanceof File) {
        const response = await runClient(
          uploadFileWorkflow({
            collection: "profiles",
            field: "backgroundPicture",
            file: data.backgroundPicture,
          }),
        );
        const handler = new FormResponseHandler(response, form);
        if (handler.hasErrors) {
          handler.setErrors();
          return;
        } else if (handler.data) {
          data.backgroundPicture = handler.data.url;
        }
      }
    } catch (e) {
      captureError(e);
      toast.error("Error al subir las imágenes");
      return;
    }

    try {
      const response = await editProfileAction({
        bio: data.bio,
        displayName: data.displayName,
        handle: data.handle,
        isPublic: data.isPublic,
        picture: typeof data.picture === "string" ? data.picture : undefined,
        backgroundPicture:
          typeof data.backgroundPicture === "string"
            ? data.backgroundPicture
            : undefined,
        tags: data.tags,
        website: data.website,
      });
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) {
        toast.success("Tu perfil ha sido actualizado");
        if (data.handle !== profile.handle) {
          router.push(`/profile/${data.handle}`);
        }
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
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Edita los datos de tu perfil para personalizar tu experiencia y
            hacer que otros usuarios puedan encontrarte y conocerte mejor.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form className="min-w-0" onSubmit={onSubmit}>
            <div>
              <InputFormField
                label="Nombre de usuario"
                name="displayName"
                placeholder="Tu nombre de usuario"
                autoComplete="name"
              />
              <div className="h-4" />
              <InputFormField
                label="Identificador"
                name="handle"
                placeholder="Tu identificador, como en X o Instagram"
                autoComplete="nickname"
              />
              <div className="h-4" />
              <SwitchSectionFormField
                name="isPublic"
                label="Perfil público"
                description="Haz que tu perfil sea visible para otros usuarios"
              />
              <div className="h-4" />
              <TextareaFormField
                label="Bio"
                name="bio"
                placeholder="Cuéntanos algo sobre ti"
              />
              <div className="h-4" />
              <TagsFormField
                label="Etiquetas"
                name="tags"
                placeholder="Tus intereses, asignaturas..."
              />
              <div className="h-4" />
              <InputFormField
                label="Página web"
                name="website"
                placeholder="Enlace a tu página web o redes sociales"
                autoComplete="nickname"
              />
              <div className="h-4" />
              <FileFormField
                label="Imagen de perfil"
                name="picture"
                accept={{
                  "image/png": [".png"],
                  "image/jpeg": [".jpeg", ".jpg"],
                }}
                isImage
                maxSize={5 * 1024 * 1024}
              />
              <div className="h-4" />
              <FileFormField
                label="Imagen de fondo"
                name="backgroundPicture"
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
