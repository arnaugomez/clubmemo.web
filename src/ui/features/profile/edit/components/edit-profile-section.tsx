"use client";

import {
  ProfileModel,
  ProfileModelData,
} from "@/src/core/profile/domain/models/profile-model";
import {
  InputFormField,
  SwitchSectionFormField,
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
import { Form } from "@/src/ui/components/shadcn/ui/form";
import { FormResponseHandler } from "@/src/ui/view-models/server-form-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { editProfileAction } from "../actions/edit-profile-action";

interface EditProfileSectionProps {
  profileData: ProfileModelData;
}

export function EditProfileSection({ profileData }: EditProfileSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const profile = new ProfileModel(profileData);
  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="secondary">
        <Edit2 className="size-4 mr-3" /> Editar
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
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await editProfileAction(data);
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
        <Form {...form}>
          <form onSubmit={onSubmit}>
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
              <InputFormField
                label="Página web"
                name="website"
                placeholder="Enlace a tu página web o redes sociales"
                autoComplete="nickname"
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
