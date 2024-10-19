import { z } from "zod";
import { AdminResourceTypeModel } from "../../domain/models/admin-resource-model";

/**
 * Validates if a value is one of the admin resource types
 */
export const AdminResourceTypeSchema = z.enum([
  AdminResourceTypeModel.courseEnrollments,
  AdminResourceTypeModel.coursePermissions,
  AdminResourceTypeModel.courses,
  AdminResourceTypeModel.emailVerificationCodes,
  AdminResourceTypeModel.fileUploads,
  AdminResourceTypeModel.forgotPasswordTokens,
  AdminResourceTypeModel.notes,
  AdminResourceTypeModel.practiceCards,
  AdminResourceTypeModel.profiles,
  AdminResourceTypeModel.rateLimits,
  AdminResourceTypeModel.reviewLogs,
  AdminResourceTypeModel.sessions,
  AdminResourceTypeModel.tags,
  AdminResourceTypeModel.users,
]);
