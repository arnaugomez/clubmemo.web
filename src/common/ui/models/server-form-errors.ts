import type { DailyRateLimitError } from "@/src/rate-limits/domain/errors/rate-limits-errors";
import type {
  FieldError,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";
import type { ZodError } from "zod";

export type FormActionResponse<T = null> = {
  errors: Record<string, FieldError>;
  data: T | null;
};

const globalErrors = {
  sessionExpired:
    "La sesión ha expirado. Refresca la página y vuelve a iniciar sesión.",
  general: "Ha ocurrido un error. Inténtalo más tarde.",
  userDoesNotExist: "El usuario no existe.",
  profileDoesNotExist: "El perfil no existe. Inicia sesión de nuevo.",
  noPermission: "No tienes permisos para realizar esta acción.",
  courseDoesNotExist: "El curso no existe.",
  cannotEditCourse: "No tienes permisos para editar este curso.",
  cannotDeleteCourse: "No tienes permisos para eliminar este curso.",
  forgotPasswordCodeExpired: "El código de recuperación ha expirado.",
  enrollmentDoesNotExist: "La inscripción no existe.",
  aiGeneratorEmptyMessage:
    "El generador de IA no ha generado ninguna tarjeta. Por favor, inténtalo de nuevo.",
  aiGeneratorError: "Error al generar las tarjetas.",
  aiGeneratorRateLimitError:
    "El generador de IA ha alcanzado su límite de peticiones. Por favor, inténtalo más tarde y avisa al equipo de clubmemo para que aumente los recursos del generador de AI.",
  userDoesNotAcceptTerms:
    "El usuario no ha aceptado los términos y condiciones",
};
type GlobalErrorType = keyof typeof globalErrors;

function createGlobalError(type: GlobalErrorType): Record<string, FieldError> {
  return {
    "root.globalError": {
      type,
      message: globalErrors[type],
    },
  };
}

export class ActionResponse {
  static formGlobalError(error: GlobalErrorType): FormActionResponse {
    return {
      errors: createGlobalError(error),
      data: null,
    };
  }

  static formError(key: string, fieldError: FieldError): FormActionResponse {
    return {
      errors: {
        [key]: fieldError,
      },
      data: null,
    };
  }

  static formSuccess<T>(data: T): FormActionResponse<T> {
    return {
      errors: {},
      data,
    };
  }

  static formZodError(zodError: ZodError): FormActionResponse {
    const errors: Record<string, FieldError> = {};
    for (const issue of zodError.errors) {
      errors[issue.path.join(".")] = {
        type: issue.code,
        message: issue.message,
      };
    }
    return {
      errors,
      data: null,
    };
  }

  static formRateLimitError(error: DailyRateLimitError): FormActionResponse {
    return {
      errors: {
        "root.globalError": {
          type: "rateLimit",
          message: `Has alcanzado el límite diario de ${error.limit} peticiones. Por favor, inténtalo más tarde.`,
        },
      },
      data: null,
    };
  }
}

export class FormResponseHandler<
  T,
  U extends FieldValues,
  V,
  W extends FieldValues | undefined,
> {
  private readonly response: FormActionResponse<T>;

  constructor(
    response: FormActionResponse<T> | undefined,
    private readonly form?: UseFormReturn<U, V, W>,
  ) {
    this.response = response || { errors: {}, data: null };
  }

  get hasErrors() {
    return Object.keys(this.response.errors).length > 0;
  }
  get data() {
    return this.response.data;
  }

  setErrors() {
    for (const [name, error] of Object.entries(this.response.errors)) {
      this.form?.setError(name as Path<U>, {
        type: error.type,
        message: error.message,
      });
    }
  }

  toastErrors() {
    for (const error of Object.values(this.response.errors)) {
      toast.error(error.message);
    }
  }

  static setGlobalError<
    U extends FieldValues,
    V,
    W extends FieldValues | undefined,
  >(form: UseFormReturn<U, V, W>) {
    form.setError("root.globalError", {
      type: "global",
      message: "Error al enviar el formulario. Inténtalo más tarde.",
    });
  }
}
