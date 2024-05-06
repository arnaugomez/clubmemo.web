import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export interface CreateErrorInput {
  name: string;
  type: string;
  message: string;
}

export type FormActionResponse<T = null> = {
  errors: CreateErrorInput[];
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
};
type GlobalErrorType = keyof typeof globalErrors;

export function createGlobalError(type: GlobalErrorType): CreateErrorInput {
  return {
    name: "root.globalError",
    type,
    message: globalErrors[type],
  };
}

export class ActionResponse {
  static formGlobalError(error: GlobalErrorType): FormActionResponse {
    return {
      errors: [createGlobalError(error)],
      data: null,
    };
  }

  static formError(error: CreateErrorInput): FormActionResponse {
    return {
      errors: [error],
      data: null,
    };
  }

  static formSuccess<T>(data: T): FormActionResponse<T> {
    return {
      errors: [],
      data,
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
    this.response = response || { errors: [], data: null };
  }

  get hasErrors() {
    return this.response.errors.length > 0;
  }
  get data() {
    return this.response.data;
  }

  setErrors() {
    for (const error of this.response.errors) {
      this.form?.setError(error.name as Path<U>, {
        type: error.type,
        message: error.message,
      });
    }
  }

  toastErrors() {
    for (const error of this.response.errors) {
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
      message: "Something went wrong",
    });
  }
}
