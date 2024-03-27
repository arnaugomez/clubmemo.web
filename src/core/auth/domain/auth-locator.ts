import { Lazy, locator } from "../../app/locator";
import { DeleteUserUseCase } from "./use-cases/delete-user-use-case";

interface AuthLocator {
  DeleteUserUseCase: Lazy<DeleteUserUseCase>;
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
};
