import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export interface CreateErrorInput {
  name: string;
  type: string;
  message: string;
}

export type FormActionResponse<T = null> = {
  errors: CreateErrorInput[];
  data: T | null;
};

const serverErrors = {
  invalidCredentials: "Invalid credentials",
};
type GlobalErrorType = keyof typeof serverErrors;

export function createServerError(type: GlobalErrorType): CreateErrorInput {
  return {
    name: "root.serverError",
    type,
    message: serverErrors[type],
  };
}

export class ActionResponse {
  static formServerError(error: GlobalErrorType): FormActionResponse {
    return {
      errors: [createServerError(error)],
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
    private readonly form: UseFormReturn<U, V, W>,
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
      this.form.setError(error.name as Path<U>, {
        type: error.type,
        message: error.message,
      });
    }
  }

  static setGeneralError<
    U extends FieldValues,
    V,
    W extends FieldValues | undefined,
  >(form: UseFormReturn<U, V, W>) {
    form.setError("root.serverError", {
      type: "general",
      message: "Something went wrong",
    });
  }
}
