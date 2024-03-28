import { Lazy, locator } from "../../app/locator";
import { ChangePasswordUseCase } from "./use-cases/change-password-use-case";
import { DeleteUserUseCase } from "./use-cases/delete-user-use-case";

interface AuthLocator {
  DeleteUserUseCase: Lazy<DeleteUserUseCase>;
  ChangePasswordUseCase: Lazy<ChangePasswordUseCase>;
}

export const authLocator: AuthLocator = {
  DeleteUserUseCase: async () => {
    const file = await import("./use-cases/delete-user-use-case");
    return new file.DeleteUserUseCase(
      locator.AuthService(),
      await locator.UsersRepository(),
      await locator.ProfilesRepository(),
    );
  },
  ChangePasswordUseCase: async () => {
    const file = await import("./use-cases/change-password-use-case");
    return new file.ChangePasswordUseCase(locator.AuthService());
  },
};
