import { Argon2id } from "oslo/password";
import { checkIfHandleAlreadyExists } from "../hooks/check-if-handle-already-exists";
import { checkIfTagAlreadyExists } from "../hooks/check-if-tag-already-exists";
import type { AdminResourceHookModel } from "../models/admin-resouce-hook-model";
import { AdminResourceTypeModel } from "../models/admin-resource-model";

const adminResourceHooksConfig: AdminResourceHookModel[] = [
  {
    resourceType: AdminResourceTypeModel.users,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeCreate: async (data, db) => {
      // TODO: ensure that the email is unique
      if (!data.newPassword) {
        //
        throw new Error("newPassword is required");
      }
      const newPassword = data.newPassword;
      delete data.newPassword;
      const secret = new TextEncoder().encode(process.env.PASSWORD_PEPPER);
      const passwordHashingAlgorithm = new Argon2id({ secret });
      data.hashed_password = await passwordHashingAlgorithm.hash(newPassword);
      return data;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeUpdate: async (id, data, db) => {
      // TODO: ensure that the email is unique
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
      await checkIfHandleAlreadyExists(data, db);
      // TODO: ensure that the handle is unique
      return data;
    },
    beforeUpdate: async (_id, data, db) => {
      await checkIfHandleAlreadyExists(data, db);
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
      await checkIfTagAlreadyExists(data.name, db);
      return data;
    },
    beforeUpdate: async (_id, data, db) => {
      await checkIfTagAlreadyExists(data.name, db);
      return data;
    },
  },
];

export function getAdminResourceHook(resourceType: AdminResourceTypeModel) {
  return adminResourceHooksConfig.find(
    (hook) => hook.resourceType === resourceType,
  );
}
