import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import type { Db, ObjectId } from "mongodb";
import { Argon2id } from "oslo/password";
import { AuthService } from "@/src/auth/layers/layer_auth-service";
import { UsersRepository } from "@/src/auth/layers/layer_users-repository";
import {
  ExternalServiceError,
  FieldValidationError,
} from "@/src/common/effect/errors";
import { EnvService } from "@/src/common/layers/layer_env-service";
import { CourseEnrollmentsRepository } from "@/src/courses/layers/layer_course-enrollments-repository";
import { CoursePermissionsRepository } from "@/src/courses/layers/layer_course-permissions-repository";
import { NotesRepository } from "@/src/notes/layers/layer_notes-repository";
import { ProfilesRepository } from "@/src/profile/layers/layer_profiles-repository";
import { checkIfEmailAlreadyExists } from "../hooks/check-if-email-already-exists";
import { checkIfHandleAlreadyExists } from "../hooks/check-if-handle-already-exists";
import { checkIfTagAlreadyExists } from "../hooks/check-if-tag-already-exists";
import type { AdminResourceHookModel } from "../models/admin-resouce-hook-model";
import type { AdminResourceData } from "../models/admin-resource-data";
import { AdminResourceTypeModel } from "../models/admin-resource-model";

export const makeAdminResourceHooks = Effect.gen(function* () {
  const services = {
    AuthService: yield* AuthService,
    UsersRepository: yield* UsersRepository,
    EnvService: yield* EnvService,
    CourseEnrollmentsRepository: yield* CourseEnrollmentsRepository,
    CoursePermissionsRepository: yield* CoursePermissionsRepository,
    NotesRepository: yield* NotesRepository,
    ProfilesRepository: yield* ProfilesRepository,
  };
  const adminResourceHooksConfig: AdminResourceHookModel[] = [
    {
      resourceType: AdminResourceTypeModel.users,
      beforeCreate: Effect.fn("Admin.beforeCreate")(function* (
        data: AdminResourceData,
        db: Db,
      ) {
        yield* checkIfEmailAlreadyExists(null, data, db);
        if (!data.newPassword) {
          return yield* Effect.fail(
            new FieldValidationError({
              path: "newPassword",
              message: "Campo requerido",
            }),
          );
        }
        const newPassword = data.newPassword;
        delete data.newPassword;
        const passwordPepper = services.EnvService.passwordPepper;
        const secret = new TextEncoder().encode(Redacted.value(passwordPepper));
        const passwordHashingAlgorithm = new Argon2id({ secret });
        data.hashed_password = yield* Effect.tryPromise({
          try: () => passwordHashingAlgorithm.hash(newPassword),
          catch: (cause) =>
            new ExternalServiceError({
              operation: "Admin.hashPassword",
              cause,
            }),
        });
        return data;
      }),
      beforeUpdate: Effect.fn("Admin.beforeUpdate")(function* (
        id: ObjectId,
        data: AdminResourceData,
        db: Db,
      ) {
        yield* checkIfEmailAlreadyExists(id, data, db);
        if (data.newPassword) {
          const newPassword = data.newPassword;
          delete data.newPassword;
          const passwordPepper = services.EnvService.passwordPepper;
          const secret = new TextEncoder().encode(
            Redacted.value(passwordPepper),
          );
          const passwordHashingAlgorithm = new Argon2id({ secret });
          data.hashed_password = yield* Effect.tryPromise({
            try: () => passwordHashingAlgorithm.hash(newPassword),
            catch: (cause) =>
              new ExternalServiceError({
                operation: "Admin.hashPassword",
                cause,
              }),
          });
        }
        return data;
      }),
      afterDelete: Effect.fn("Admin.afterDelete")(function* (id: ObjectId) {
        const userId = id.toString();
        const profilesRepository = services.ProfilesRepository;
        const authService = services.AuthService;
        yield* Effect.all(
          [
            profilesRepository.deleteByUserId(userId),
            authService.invalidateUserSessions(userId),
          ],
          { concurrency: "unbounded" },
        );
      }),
    },
    {
      resourceType: AdminResourceTypeModel.profiles,
      beforeCreate: Effect.fn("Admin.beforeCreate")(function* (
        data: AdminResourceData,
        db: Db,
      ) {
        yield* checkIfHandleAlreadyExists(null, data, db);
        return data;
      }),
      beforeUpdate: Effect.fn("Admin.beforeUpdate")(function* (
        id: ObjectId,
        data: AdminResourceData,
        db: Db,
      ) {
        yield* checkIfHandleAlreadyExists(id, data, db);
        return data;
      }),
      afterDelete: Effect.fn("Admin.afterDelete")(function* (
        _id: ObjectId,
        data: AdminResourceData,
      ) {
        const userId = data.userId?.toString();
        if (!userId) return;
        const profilesRepository = services.ProfilesRepository;
        const usersRepository = services.UsersRepository;
        const authService = services.AuthService;
        yield* Effect.all(
          [
            profilesRepository.deleteByUserId(userId),
            usersRepository.delete(userId),
            authService.invalidateUserSessions(userId),
          ],
          { concurrency: "unbounded" },
        );
      }),
    },
    {
      resourceType: AdminResourceTypeModel.tags,
      beforeCreate: Effect.fn("Admin.beforeCreate")(function* (
        data: AdminResourceData,
        db: Db,
      ) {
        yield* checkIfTagAlreadyExists(null, data, db);
        return data;
      }),
      beforeUpdate: Effect.fn("Admin.beforeUpdate")(function* (
        id: ObjectId,
        data: AdminResourceData,
        db: Db,
      ) {
        yield* checkIfTagAlreadyExists(id, data, db);
        return data;
      }),
    },
    {
      resourceType: AdminResourceTypeModel.courses,
      afterDelete: Effect.fn("Admin.afterDelete")(function* (id: ObjectId) {
        const courseId = id.toString();
        const courseEnrollmentsRepository =
          services.CourseEnrollmentsRepository;
        const coursePermissionsRepository =
          services.CoursePermissionsRepository;
        const notesRepository = services.NotesRepository;
        yield* Effect.all(
          [
            courseEnrollmentsRepository.deleteByCourseId(courseId),
            coursePermissionsRepository.deleteByCourseId(courseId),
            notesRepository.deleteByCourseId(courseId),
          ],
          { concurrency: "unbounded" },
        );
      }),
    },
  ];

  return {
    get: (resourceType: AdminResourceTypeModel) =>
      adminResourceHooksConfig.find(
        (hook) => hook.resourceType === resourceType,
      ),
  };
});
export type AdminResourceHooks = Effect.Success<typeof makeAdminResourceHooks>;
export const AdminResourceHooks = Context.Service<AdminResourceHooks>(
  "clubmemo/admin/AdminResourceHooks",
);
export const AdminResourceHooksLive = Layer.effect(
  AdminResourceHooks,
  makeAdminResourceHooks,
);
