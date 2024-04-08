import { Lazy, locator } from "../app/locator";
import type { ChangePasswordUseCase } from "./domain/use-cases/change-password-use-case";
import type { DeleteUserUseCase } from "./domain/use-cases/delete-user-use-case";

interface AuthLocator {
  DeleteUserUseCase: Lazy<DeleteUserUseCase>;
  ChangePasswordUseCase: Lazy<ChangePasswordUseCase>;
}

export const authLocator: AuthLocator = {
  DeleteUserUseCase: async () => {
    const file = await import("./domain/use-cases/delete-user-use-case");
    return new file.DeleteUserUseCase(
      locator.AuthService(),
      await locator.UsersRepository(),
      await locator.ProfilesRepository(),
    );
  },
  ChangePasswordUseCase: async () => {
    const file = await import("./domain/use-cases/change-password-use-case");
    return new file.ChangePasswordUseCase(locator.AuthService());
  },
};
