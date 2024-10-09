"use client";

import { z } from "@/i18n/zod";
import { OptionalFileFieldSchema } from "@/src/common/schemas/file-schema";
import { HandleSchema } from "@/src/common/schemas/handle-schema";

import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";
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
import { locator_fileUpload_ClientFileUploadService } from "@/src/file-upload/locators/locator_client-file-upload-service";
import { uploadFileAction } from "@/src/file-upload/ui/actions/upload-file-action";
import type { ProfileModelData } from "@/src/profile/domain/models/profile-model";
import { ProfileModel } from "@/src/profile/domain/models/profile-model";
import { TagsSchema } from "@/src/tags/domain/schemas/tags-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
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
const EditProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(50),
  handle: HandleSchema,
  bio: z.string().trim().min(0).max(255),
  website: z.string().url().max(2083).or(z.string().max(0)),
  isPublic: z.boolean(),
  tags: TagsSchema,
  picture: OptionalFileFieldSchema,
  backgroundPicture: OptionalFileFieldSchema,
});

type FormValues = z.infer<typeof EditProfileSchema>;

/**
 * Dialog with a form to edit the profile
 */
function EditProfileDialog({ profile, onClose }: EditProfileDialogProps) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(EditProfileSchema),
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
        const response = await uploadFileAction({
          collection: "profiles",
          field: "picture",
          contentType: data.picture.type,
        });
        const handler = new FormResponseHandler(response, form);
        if (handler.hasErrors) {
          handler.setErrors();
          return;
        } else if (handler.data) {
          const fileUploadService =
            locator_fileUpload_ClientFileUploadService();
          await fileUploadService.uploadPresignedUrl({
            file: data.picture,
            presignedUrl: handler.data.presignedUrl,
          });
          data.picture = handler.data.url;
        }
      }
      if (data.backgroundPicture instanceof File) {
        const response = await uploadFileAction({
          collection: "profiles",
          field: "backgroundPicture",
          contentType: data.backgroundPicture.type,
        });
        const handler = new FormResponseHandler(response, form);
        if (handler.hasErrors) {
          handler.setErrors();
          return;
        } else if (handler.data) {
          const fileUploadService =
            locator_fileUpload_ClientFileUploadService();
          await fileUploadService.uploadPresignedUrl({
            file: data.backgroundPicture,
            presignedUrl: handler.data.presignedUrl,
          });
          data.backgroundPicture = handler.data.url;
        }
      }
    } catch (e) {
      locator_common_ErrorTrackingService().captureError(e);
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
      locator_common_ErrorTrackingService().captureError(e);
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
