import { Argon2id } from "oslo/password";
import { ZodError, ZodIssueCode } from "zod";
import { checkIfEmailAlreadyExists } from "../hooks/check-if-email-already-exists";
import { checkIfHandleAlreadyExists } from "../hooks/check-if-handle-already-exists";
import { checkIfTagAlreadyExists } from "../hooks/check-if-tag-already-exists";
import type { AdminResourceHookModel } from "../models/admin-resouce-hook-model";
import { AdminResourceTypeModel } from "../models/admin-resource-model";

const adminResourceHooksConfig: AdminResourceHookModel[] = [
  {
    resourceType: AdminResourceTypeModel.users,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      const secret = new TextEncoder().encode(process.env.PASSWORD_PEPPER);
      const passwordHashingAlgorithm = new Argon2id({ secret });
      data.hashed_password = await passwordHashingAlgorithm.hash(newPassword);
      return data;
    },
    beforeUpdate: async (id, data, db) => {
      await checkIfEmailAlreadyExists(id, data, db);
      if (data.newPassword) {
        const newPassword = data.newPassword;
        delete data.newPassword;
        const secret = new TextEncoder().encode(process.env.PASSWORD_PEPPER);
        const passwordHashingAlgorithm = new Argon2id({ secret });
        data.hashed_password = await passwordHashingAlgorithm.hash(newPassword);
      }
      return data;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    afterDelete: async (id, data, db) => {
      // TODO: delete sessions and stuff
    },
  },
  {
    resourceType: AdminResourceTypeModel.profiles,
    beforeCreate: async (data, db) => {
      await checkIfHandleAlreadyExists(null, data, db);
      // TODO: ensure that the handle is unique
      return data;
    },
    beforeUpdate: async (id, data, db) => {
      await checkIfHandleAlreadyExists(id, data, db);
      return data;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    afterDelete: async (id, data, db) => {
      // TODO: delete user, sessions and stuff
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
];

export function getAdminResourceHook(resourceType: AdminResourceTypeModel) {
  return adminResourceHooksConfig.find(
    (hook) => hook.resourceType === resourceType,
  );
}
