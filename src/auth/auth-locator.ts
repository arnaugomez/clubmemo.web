import type { Dependency, Lazy } from "../common/locator";
import { locator } from "../common/locator";
import type { ChangePasswordUseCase } from "./domain/use-cases/change-password-use-case";
import type { DeleteUserUseCase } from "./domain/use-cases/delete-user-use-case";
import { GetSessionUseCase } from "./domain/use-cases/get-session-use-case";
import type { LoginWithPasswordUseCase } from "./domain/use-cases/login-with-password-use-case";

interface AuthLocator {
  GetSessionUseCase: Dependency<GetSessionUseCase>;
  LoginWithPasswordUseCase: Lazy<LoginWithPasswordUseCase>;
  DeleteUserUseCase: Lazy<DeleteUserUseCase>;
  ChangePasswordUseCase: Lazy<ChangePasswordUseCase>;
}

export const authLocator: AuthLocator = {
  GetSessionUseCase() {
    return new GetSessionUseCase(locator.AuthService());
  },
  async LoginWithPasswordUseCase() {
    const file = await import(
      "./domain/use-cases/login-with-password-use-case"
    );
    return new file.LoginWithPasswordUseCase(
      locator.AuthService(),
      await locator.IpService(),
      locator.RateLimitsRepository(),
    );
  },
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
    return new file.ChangePasswordUseCase(
      locator.AuthService(),
      locator.RateLimitsRepository(),
    );
  },
};
