import {
  SliderFormField,
  SwitchSectionFormField,
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
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { CourseEnrollmentModel } from "@/src/courses/domain/models/course-enrollment-model";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { default_maximum_interval } from "ts-fsrs";
import { z } from "zod";
import { editCourseConfigAction } from "../actions/edit-course-config-action";

const EditCourseConfigSchema = z.object({
  enableFuzz: z.boolean(),
  maximumInterval: z.number().min(1).max(default_maximum_interval),
  requestRetention: z.number().min(0).max(1),
  dailyNewCardsCount: z.number().min(1).max(100),
  showAdvancedRatingOptions: z.boolean(),
});

type FormValues = z.infer<typeof EditCourseConfigSchema>;

interface EditCourseConfigDialogProps {
  enrollment: CourseEnrollmentModel;
  onClose: () => void;
}
export function EditCourseConfigDialog({
  enrollment,
  onClose,
}: EditCourseConfigDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(EditCourseConfigSchema),
    defaultValues: {
      dailyNewCardsCount: enrollment.config.dailyNewCardsCount,
      enableFuzz: enrollment.config.enableFuzz,
      maximumInterval: enrollment.config.maximumInterval,
      requestRetention: enrollment.config.requestRetention,
      showAdvancedRatingOptions: enrollment.config.showAdvancedRatingOptions,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await editCourseConfigAction({
        enrollmentId: enrollment.id,
        ...data,
      });
      const handler = new FormResponseHandler(response, form);
      if (!handler.hasErrors) {
        toast.success("La configuración del curso ha sido actualizada");
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
      <DialogContent
        onClose={isSubmitting ? undefined : onClose}
        className="sm:max-w-3xl"
      >
        <DialogHeader>
          <DialogTitle className={textStyles.h3}>Ajustes del curso</DialogTitle>
          <DialogDescription>
            Cambia la configuración del curso para ajustar la forma en la que se
            presentan las tarjetas. Personaliza el aprendizaje a tu medida y
            necesidades.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <div className="h-2"></div>
              <DialogTitle>Parámetros del algoritmo</DialogTitle>
              <div className="h-1"></div>
              <p className={textStyles.muted}>
                Usamos el algoritmo FSRS para determinar qué tan a menudo hay
                que practicar cada tarjeta. Puedes leer sobre su funcionamiento
                y parámetros en la{" "}
                <a
                  href="https://github.com/open-spaced-repetition/free-spaced-repetition-scheduler"
                  className="underline hover:text-slate-700"
                >
                  documentación del algoritmo
                </a>
                .
              </p>
              <div className="h-4"></div>
              <SliderFormField
                label="Retención esperada (request_retention)"
                description="Proporción de tarjetas que esperas responder correctamente. Se mide en tanto por 1. Es un parámetro importante del algoritmo: un valor alto implica una mayor carga de trabajo. Recomendamos un valor entre 0.70 y 0.97"
                name="requestRetention"
                step={0.01}
                max={1}
              />
              <div className="h-4" />
              <SwitchSectionFormField
                label="Permitir aleatoriedad (enable_fuzz)"
                description="Habilita la aleatoriedad en el algoritmo para evitar que las tarjetas se presenten siempre en el mismo orden."
                name="enableFuzz"
              />
              <div className="h-4" />
              <SliderFormField
                label="Intervalo máximo (maximum_interval)"
                description="El intervalo máximo entre repeticiones de una tarjeta (en días)."
                name="maximumInterval"
                max={default_maximum_interval}
              />
              <div className="h-6"></div>
              <DialogTitle>Ajustes de práctica</DialogTitle>
              <div className="h-1"></div>
              <p className={textStyles.muted}>
                Personaliza la forma en la que practicas las tarjetas
              </p>
              <div className="h-4"></div>
              <SwitchSectionFormField
                label="Mostrar opciones de calificación avanzadas"
                description="Mostrar 4 opciones (Mal / Difícil / Bien / Fácil) en vez de 2 (Mal / Bien) en la revisión de tarjetas."
                name="showAdvancedRatingOptions"
              />
              <div className="h-4"></div>
              <SliderFormField
                label="Cantidad diaria de tarjetas nuevas"
                description="Cuántas tarjetas quieres empezar a aprender cada día"
                name="dailyNewCardsCount"
                max={100}
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
