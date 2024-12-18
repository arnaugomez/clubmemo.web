import { AuthTypeModel } from "@/src/auth/domain/models/auth-type-model";
import { AcceptTermsSchema } from "@/src/common/schemas/accept-terms-schema";
import { OptionalFileFieldSchema } from "@/src/common/schemas/file-schema";
import { HandleSchema } from "@/src/common/schemas/handle-schema";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { PasswordSchema } from "@/src/common/schemas/password-schema";
import { CoursePermissionTypeModel } from "@/src/courses/domain/models/course-permission-type-model";
import { PracticeCardRatingModelSchema } from "@/src/practice/domain/schemas/practice-card-rating-model-schema";
import { PracticeCardStateModelSchema } from "@/src/practice/domain/schemas/practice-card-state-model-schema";
import {
  TagNameSchema,
  TagsSchema,
} from "@/src/tags/domain/schemas/tags-schema";
import { default_maximum_interval } from "ts-fsrs";
import type { ZodSchema } from "zod";
import { z } from "zod";
import { AdminResourceTypeModel } from "../models/admin-resource-model";

/**
 * Validation schemas for the create and update forms of the admin panel. Each
 * admin resource has different fields and therefore has different validation
 * schema. The validation schemas are built with the Zod validation library.
 */
const adminResourceSchemas: Record<AdminResourceTypeModel, ZodSchema> = {
  [AdminResourceTypeModel.courseEnrollments]: z.object({
    courseId: ObjectIdSchema,
    profileId: ObjectIdSchema,
    isFavorite: z.boolean(),
    config: z
      .object({
        enableFuzz: z.boolean().optional(),
        maximumInterval: z
          .number()
          .int()
          .min(1)
          .max(default_maximum_interval)
          .optional(),
        requestRetention: z.number().min(0).max(1).optional(),
        dailyNewCardsCount: z.number().int().min(1).max(100).optional(),
        showAdvancedRatingOptions: z.boolean().optional(),
      })
      .optional(),
  }),
  [AdminResourceTypeModel.coursePermissions]: z.object({
    courseId: ObjectIdSchema,
    profileId: ObjectIdSchema,
    permissionType: z.enum([
      CoursePermissionTypeModel.edit,
      CoursePermissionTypeModel.view,
      CoursePermissionTypeModel.own,
    ]),
  }),
  [AdminResourceTypeModel.courses]: z.object({
    name: z.string().trim().min(1).max(50),
    description: z.string().trim().min(0).max(255),
    picture: OptionalFileFieldSchema,
    isPublic: z.boolean(),
    tags: TagsSchema,
  }),
  [AdminResourceTypeModel.emailVerificationCodes]: z.object({
    userId: ObjectIdSchema,
    code: z.string().length(6),
    expiresAt: z.date(),
  }),
  [AdminResourceTypeModel.fileUploads]: z.object({
    collection: z.enum(["profiles", "courses"]),
    field: z.string().min(1),
    url: z.string().url(),
    key: z.string().min(1),
    contentType: z.string(),
    createdByUserId: ObjectIdSchema,
    createdAt: z.date(),
  }),
  [AdminResourceTypeModel.forgotPasswordTokens]: z.object({
    userId: ObjectIdSchema,
    expiresAt: z.date(),
  }),
  [AdminResourceTypeModel.notes]: z.object({
    courseId: ObjectIdSchema,
    front: z.string(),
    back: z.string(),
    createdAt: z.date(),
  }),
  [AdminResourceTypeModel.practiceCards]: z.object({
    courseEnrollmentId: ObjectIdSchema,
    noteId: ObjectIdSchema,
    due: z.date(),
    stability: z.number(),
    difficulty: z.number(),
    elapsedDays: z.number().int(),
    scheduledDays: z.number().int(),
    reps: z.number().int(),
    lapses: z.number().int(),
    state: PracticeCardStateModelSchema,
    lastReview: z
      .date()
      .optional()
      .nullish()
      .transform((x) => x ?? undefined),
  }),
  [AdminResourceTypeModel.profiles]: z.object({
    userId: ObjectIdSchema,
    displayName: z.string().optional(),
    handle: HandleSchema.optional().or(
      z.literal("").transform((value) => value || undefined),
    ),
    bio: z.string().optional(),
    website: z.string().url().max(2083).optional().or(z.string().max(0)),
    isPublic: z.boolean(),
    tags: TagsSchema,
    picture: OptionalFileFieldSchema,
    backgroundPicture: OptionalFileFieldSchema,
  }),
  [AdminResourceTypeModel.rateLimits]: z.object({
    name: z.string(),
    count: z.number().int(),
    updatedAt: z.date(),
  }),
  [AdminResourceTypeModel.reviewLogs]: z.object({
    cardId: ObjectIdSchema,
    courseEnrollmentId: ObjectIdSchema,
    rating: PracticeCardRatingModelSchema,
    state: PracticeCardStateModelSchema,
    due: z.date(),
    stability: z.number(),
    difficulty: z.number(),
    elapsedDays: z.number().int(),
    lastElapsedDays: z.number().int(),
    scheduledDays: z.number().int(),
    review: z.date(),
  }),
  [AdminResourceTypeModel.sessions]: z.object({
    expires_at: z.date(),
    user_id: ObjectIdSchema,
  }),
  [AdminResourceTypeModel.tags]: z.object({ name: TagNameSchema }),
  [AdminResourceTypeModel.users]: z.object({
    email: z.string().email(),
    authTypes: z.array(z.enum([AuthTypeModel.email])).min(1),
    acceptTerms: AcceptTermsSchema,
    isEmailVerified: z.boolean().optional(),
    isAdmin: z.boolean().optional(),
    newPassword: PasswordSchema.or(z.literal("").optional()),
  }),
};

/**
 * Special validation schemas that are applied on the create form. If not
 * available, the schema from `adminResourceSchemas` shall be used.
 */
const adminResourceCreateSchemas: Partial<
  Record<AdminResourceTypeModel, ZodSchema>
> = {
  [AdminResourceTypeModel.users]: z.object({
    email: z.string().email(),
    authTypes: z.array(z.enum([AuthTypeModel.email])).min(1),
    acceptTerms: AcceptTermsSchema,
    isEmailVerified: z.boolean().optional(),
    isAdmin: z.boolean().optional(),
    newPassword: PasswordSchema,
  }),
};

interface GetAdminResourceSchemaInput {
  /**
   * The type of admin resource
   */
  resourceType: AdminResourceTypeModel;
  /**
   * Whether the schema should be used to validate the data from the create
   * form, or the edit form.
   */
  isCreate: boolean;
}
/**
 * Gets a Zod validation schema for a form of a certain admin resource
 *
 * @returns The validation schema or `undefined` if it does not exist.
 */
export function getAdminResourceSchema({
  resourceType,
  isCreate,
}: GetAdminResourceSchemaInput) {
  const schema = adminResourceSchemas[resourceType];
  if (isCreate) {
    return adminResourceCreateSchemas[resourceType] ?? schema;
  }
  return schema;
}
