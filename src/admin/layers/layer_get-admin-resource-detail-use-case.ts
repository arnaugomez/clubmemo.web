import * as Layer from "effect/Layer";
import {
  GetAdminResourceDetailUseCase,
  GetAdminResourceDetailUseCaseService,
} from "../domain/use-cases/get-admin-resource-detail-use-case";

export { GetAdminResourceDetailUseCaseService };
export const GetAdminResourceDetailUseCaseLive = Layer.effect(
  GetAdminResourceDetailUseCaseService,
  GetAdminResourceDetailUseCase.make,
);
