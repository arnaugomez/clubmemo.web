"use client";

import {
  FileFormField,
  InputFormField,
  SwitchSectionFormField,
  TagsFormField,
  TextareaFormField,
} from "@/src/common/ui/components/form/form-fields";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
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
import type { ProfileModelData } from "@/src/profile/domain/models/profile-model";
import { ProfileModel } from "@/src/profile/domain/models/profile-model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { editProfileAction } from "../actions/edit-profile-action";
import { editProfileUploadAction } from "../actions/edit-profile-upload-action";

interface EditProfileSectionProps {
  profileData: ProfileModelData;
}

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

const EditProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(50),
  handle: z
    .string()
    .min(1)
    .max(15)
    .regex(/^[a-zA-Z0-9_]+$/),
  bio: z.string().trim().min(0).max(255),
  website: z.string().url().max(2083).or(z.string().max(0)),
  isPublic: z.boolean(),
  tags: z.array(z.string().trim().min(1).max(50)).max(10),
  picture: z.string().or(z.instanceof(File)).optional(),
  backgroundPicture: z.string().or(z.instanceof(File)).optional(),
});

type FormValues = z.infer<typeof EditProfileSchema>;

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
      const uploadActionResponse = await editProfileUploadAction({
        pictureContentType:
          data.picture instanceof File ? data.picture.type : "",
        backgroundPictureContentType:
          data.backgroundPicture instanceof File
            ? data.backgroundPicture.type
            : "",
        uploadPicture: data.picture instanceof File,
        uploadBackgroundPicture: data.backgroundPicture instanceof File,
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
          const { url, fields } = uploadActionHandler.data.picture.presignedUrl;

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
            data.picture = uploadActionHandler.data.picture.url;
          }
        }
        if (
          uploadActionHandler.data.backgroundPicture &&
          data.backgroundPicture instanceof File
        ) {
          const { url, fields } =
            uploadActionHandler.data.backgroundPicture.presignedUrl;

          const formData = new FormData();
          Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value as string);
          });
          formData.append("file", data.backgroundPicture);

          const uploadResponse = await fetch(url, {
            method: "POST",
            body: formData,
          });

          if (uploadResponse.ok) {
            data.backgroundPicture =
              uploadActionHandler.data.backgroundPicture.url;
          }
        }
      }

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
                autoComplete="username"
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
