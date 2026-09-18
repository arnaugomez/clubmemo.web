import * as Layer from "effect/Layer";
import {
  CheckIsAdminUseCase,
  CheckIsAdminUseCaseService,
} from "../domain/use-cases/check-is-admin-use-case";

export { CheckIsAdminUseCaseService };
export const CheckIsAdminUseCaseLive = Layer.effect(
  CheckIsAdminUseCaseService,
  CheckIsAdminUseCase.make,
);
