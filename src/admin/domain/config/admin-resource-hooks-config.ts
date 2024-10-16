import { locator_auth_AuthService } from "@/src/auth/locators/locator_auth-service";
import { locator } from "@/src/common/di/locator";
import { locator_common_EnvService } from "@/src/common/locators/locator_env-service";
import { locator_courses_CoursePermissionsRepository } from "@/src/courses/locators/locator_course-permissions-repository";
import { locator_profiles_ProfilesRepository } from "@/src/profile/locators/locator_profiles-repository";
import { Argon2id } from "oslo/password";
import { ZodError, ZodIssueCode } from "zod";
import { checkIfEmailAlreadyExists } from "../hooks/check-if-email-already-exists";
import { checkIfHandleAlreadyExists } from "../hooks/check-if-handle-already-exists";
import { checkIfTagAlreadyExists } from "../hooks/check-if-tag-already-exists";
import type { AdminResourceHookModel } from "../models/admin-resouce-hook-model";
import { AdminResourceTypeModel } from "../models/admin-resource-model";
import { locator_auth_UsersRepository } from "@/src/auth/locators/locator_users-repository";

const adminResourceHooksConfig: AdminResourceHookModel[] = [
  {
    resourceType: AdminResourceTypeModel.users,
    beforeCreate: async (data, db) => {
      await checkIfEmailAlreadyExists(null, data, db);
      if (!data.newPassword) {
        throw new ZodError([
          {
            path: ["newPassword"],
            code: ZodIssueCode.invalid_type,
            expected: "string",
            received: "undefined",
            message: "Campo requerido",
          },
        ]);
      }
      const newPassword = data.newPassword;
      delete data.newPassword;
      const passwordPepper = locator_common_EnvService().passwordPepper;
      const secret = new TextEncoder().encode(passwordPepper);
      const passwordHashingAlgorithm = new Argon2id({ secret });
      data.hashed_password = await passwordHashingAlgorithm.hash(newPassword);
      return data;
    },
    beforeUpdate: async (id, data, db) => {
      await checkIfEmailAlreadyExists(id, data, db);
      if (data.newPassword) {
        const newPassword = data.newPassword;
        delete data.newPassword;
        const passwordPepper = locator_common_EnvService().passwordPepper;
        const secret = new TextEncoder().encode(passwordPepper);
        const passwordHashingAlgorithm = new Argon2id({ secret });
        data.hashed_password = await passwordHashingAlgorithm.hash(newPassword);
      }
      return data;
    },
    afterDelete: async (id) => {
      const userId = id.toString();
      const profilesRepository = locator_profiles_ProfilesRepository();
      const authService = locator_auth_AuthService();
      await Promise.all([
        profilesRepository.deleteByUserId(userId),
        authService.invalidateUserSessions(userId),
      ]);
    },
  },
  {
    resourceType: AdminResourceTypeModel.profiles,
    beforeCreate: async (data, db) => {
      await checkIfHandleAlreadyExists(null, data, db);
      return data;
    },
    beforeUpdate: async (id, data, db) => {
      await checkIfHandleAlreadyExists(id, data, db);
      return data;
    },
    afterDelete: async (_id, data) => {
      const userId = data.userId?.toString();
      if (!userId) return;
      const profilesRepository = locator_profiles_ProfilesRepository();
      const usersRepository = locator_auth_UsersRepository();
      const authService = locator_auth_AuthService();
      await Promise.all([
        profilesRepository.deleteByUserId(userId),
        usersRepository.delete(userId),
        authService.invalidateUserSessions(userId),
      ]);
    },
  },
  {
    resourceType: AdminResourceTypeModel.tags,
    beforeCreate: async (data, db) => {
      await checkIfTagAlreadyExists(null, data, db);
      return data;
    },
    beforeUpdate: async (id, data, db) => {
      await checkIfTagAlreadyExists(id, data, db);
      return data;
    },
  },
  {
    resourceType: AdminResourceTypeModel.courses,
    afterDelete: async (id) => {
      const courseId = id.toString();
      const courseEnrollmentsRepository =
        await locator.CourseEnrollmentsRepository();
      const coursePermissionsRepository =
        locator_courses_CoursePermissionsRepository();
      const notesRepository = await locator.NotesRepository();
      await Promise.all([
        courseEnrollmentsRepository.deleteByCourseId(courseId),
        coursePermissionsRepository.deleteByCourseId(courseId),
        notesRepository.deleteByCourseId(courseId),
      ]);
    },
  },
];

export function getAdminResourceHook(resourceType: AdminResourceTypeModel) {
  return adminResourceHooksConfig.find(
    (hook) => hook.resourceType === resourceType,
  );
}
