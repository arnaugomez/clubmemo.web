import { InputFormField } from "@/src/common/ui/components/form/form-fields";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createCourseAction } from "../actions/create-course-action";
import { CreateCourseSchema } from "../schemas/create-course-schema";

interface CreateCourseDialogProps {
  onClose: () => void;
}
type FormValues = z.infer<typeof CreateCourseSchema>;
export function CreateCourseDialog({ onClose }: CreateCourseDialogProps) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await createCourseAction(data);
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) {
        router.push(`/courses/detail/${handler.data?.id}`);
        toast.success("El curso ha sido creado");
      }
      handler.setErrors();
    } catch (error) {
      console.error(error);
      FormResponseHandler.setGlobalError(form);
    }
  });

  const { isSubmitting } = form.formState;
  return (
    <Dialog open>
      <DialogContent onClose={isSubmitting ? undefined : onClose}>
        <DialogHeader>
          <DialogTitle>Nuevo curso</DialogTitle>
          <DialogDescription>
            Un curso es una colección de tarjetas de aprendizaje. Los cursos te
            permiten organizar tu aprendizaje por categorías.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <InputFormField
                label="Nombre del curso"
                name="name"
                placeholder={'Por ejemplo, "Matemáticas 1"'}
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
              <FormSubmitButton>Crear curso</FormSubmitButton>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
