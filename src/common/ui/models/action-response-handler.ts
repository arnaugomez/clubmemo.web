import { toast } from "sonner";
import type { FormActionResponse } from "./server-form-errors";

export class ActionResponseHandler<T> {
  private readonly response: FormActionResponse<T>;

  constructor(response: FormActionResponse<T> | undefined) {
    this.response = response || { errors: {}, data: null };
  }

  get hasErrors() {
    return Object.keys(this.response.errors).length > 0;
  }
  get data() {
    return this.response.data;
  }

  toastErrors() {
    for (const error of Object.values(this.response.errors)) {
      toast.error(error.message);
    }
  }
}
