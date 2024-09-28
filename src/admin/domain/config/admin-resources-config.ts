import { AuthTypeModel } from "@/src/auth/domain/models/auth-type-model";
import { PracticeCardRatingModel } from "@/src/practice/domain/models/practice-card-rating-model";
import { PracticeCardStateModel } from "@/src/practice/domain/models/practice-card-state-model";
import { InvalidAdminResourceTypeError } from "../models/admin-errors";
import {
  AdminFieldTypeModel,
  AdminResourceTypeModel,
  type AdminResourceModel,
} from "../models/admin-resource-model";

const practiceCardStateOptions = [
  PracticeCardStateModel.learning,
  PracticeCardStateModel.new,
  PracticeCardStateModel.relearning,
  PracticeCardStateModel.review,
];

export const adminResourcesConfig: AdminResourceModel[] = [
  {
    resourceType: AdminResourceTypeModel.tags,
    fields: [{ name: "name", fieldType: AdminFieldTypeModel.string }],
  },
  {
    resourceType: AdminResourceTypeModel.reviewLogs,
    fields: [
      { name: "cardId", fieldType: AdminFieldTypeModel.objectId },
      { name: "courseEnrollmentId", fieldType: AdminFieldTypeModel.objectId },
      {
        name: "rating",
        fieldType: AdminFieldTypeModel.select,
        options: [
          PracticeCardRatingModel.again,
          PracticeCardRatingModel.easy,
          PracticeCardRatingModel.good,
          PracticeCardRatingModel.hard,
          PracticeCardRatingModel.manual,
        ],
      },
      {
        name: "state",
        fieldType: AdminFieldTypeModel.select,
        options: practiceCardStateOptions,
      },
      { name: "due", fieldType: AdminFieldTypeModel.date },
      { name: "stability", fieldType: AdminFieldTypeModel.number },
      { name: "difficulty", fieldType: AdminFieldTypeModel.number },
      { name: "elapsedDays", fieldType: AdminFieldTypeModel.number },
      { name: "lastElapsedDays", fieldType: AdminFieldTypeModel.number },
      { name: "scheduledDays", fieldType: AdminFieldTypeModel.number },
      { name: "review", fieldType: AdminFieldTypeModel.date },
    ],
  },
  {
    resourceType: AdminResourceTypeModel.rateLimits,
    fields: [
      { name: "name", fieldType: AdminFieldTypeModel.string },
      { name: "count", fieldType: AdminFieldTypeModel.number },
      { name: "updatedAt", fieldType: AdminFieldTypeModel.date },
    ],
  },
  {
    resourceType: AdminResourceTypeModel.profiles,
    fields: [
      { name: "userId", fieldType: AdminFieldTypeModel.objectId },
      { name: "displayName", fieldType: AdminFieldTypeModel.string },
      { name: "handle", fieldType: AdminFieldTypeModel.string },
      { name: "bio", fieldType: AdminFieldTypeModel.string },
      { name: "picture", fieldType: AdminFieldTypeModel.string },
      { name: "backgroundPicture", fieldType: AdminFieldTypeModel.string },
      { name: "website", fieldType: AdminFieldTypeModel.string },
      { name: "isPublic", fieldType: AdminFieldTypeModel.boolean },
      { name: "tags", fieldType: AdminFieldTypeModel.tags },
    ],
  },
  {
    resourceType: AdminResourceTypeModel.practiceCards,
    fields: [
      { name: "courseEnrollmentId", fieldType: AdminFieldTypeModel.objectId },
      { name: "noteId", fieldType: AdminFieldTypeModel.objectId },
      { name: "due", fieldType: AdminFieldTypeModel.date },
      { name: "stability", fieldType: AdminFieldTypeModel.number },
      { name: "difficulty", fieldType: AdminFieldTypeModel.number },
      { name: "elapsedDays", fieldType: AdminFieldTypeModel.number },
      { name: "scheduledDays", fieldType: AdminFieldTypeModel.number },
      { name: "reps", fieldType: AdminFieldTypeModel.number },
      { name: "lapses", fieldType: AdminFieldTypeModel.number },
      {
        name: "state",
        fieldType: AdminFieldTypeModel.select,
        options: practiceCardStateOptions,
      },
      { name: "lastReview", fieldType: AdminFieldTypeModel.date },
    ],
  },

  {
    resourceType: AdminResourceTypeModel.notes,
    fields: [
      { name: "courseId", fieldType: AdminFieldTypeModel.objectId },
      { name: "front", fieldType: AdminFieldTypeModel.string },
      { name: "back", fieldType: AdminFieldTypeModel.string },
      { name: "createdAt", fieldType: AdminFieldTypeModel.date },
    ],
  },
  {
    resourceType: AdminResourceTypeModel.forgotPasswordTokens,
    fields: [
      { name: "userId", fieldType: AdminFieldTypeModel.objectId },
      {
        name: "tokenHash",
        isReadonly: true,
        fieldType: AdminFieldTypeModel.string,
      },
      { name: "expiresAt", fieldType: AdminFieldTypeModel.date },
    ],
  },
  {
    resourceType: AdminResourceTypeModel.emailVerificationCodes,
    fields: [
      { name: "userId", fieldType: AdminFieldTypeModel.objectId },
      { name: "code", fieldType: AdminFieldTypeModel.string },
      { name: "expiresAt", fieldType: AdminFieldTypeModel.date },
    ],
  },
  {
    resourceType: AdminResourceTypeModel.courseEnrollments,
    fields: [
      { name: "courseId", fieldType: AdminFieldTypeModel.objectId },
      { name: "profileId", fieldType: AdminFieldTypeModel.objectId },
      { name: "isFavorite", fieldType: AdminFieldTypeModel.boolean },
      {
        name: "config",
        fieldType: AdminFieldTypeModel.form,
        fields: [
          { name: "enableFuzz", fieldType: AdminFieldTypeModel.boolean },
          { name: "maximumInterval", fieldType: AdminFieldTypeModel.number },
          { name: "requestRetention", fieldType: AdminFieldTypeModel.number },
          { name: "dailyNewCardsCount", fieldType: AdminFieldTypeModel.number },
          {
            name: "showAdvancedRatingOptions",
            fieldType: AdminFieldTypeModel.boolean,
          },
        ],
      },
    ],
  },
  {
    resourceType: AdminResourceTypeModel.coursePermissions,
    fields: [
      { name: "courseId", fieldType: AdminFieldTypeModel.objectId },
      { name: "profileId", fieldType: AdminFieldTypeModel.objectId },
      { name: "permissionType", fieldType: AdminFieldTypeModel.string },
    ],
  },
  {
    resourceType: AdminResourceTypeModel.courses,
    fields: [
      { name: "name", fieldType: AdminFieldTypeModel.string },
      { name: "description", fieldType: AdminFieldTypeModel.string },
      { name: "picture", fieldType: AdminFieldTypeModel.string },
      { name: "isPublic", fieldType: AdminFieldTypeModel.boolean },
      { name: "tags", fieldType: AdminFieldTypeModel.tags },
    ],
  },
  {
    resourceType: AdminResourceTypeModel.sessions,
    cannotCreate: true,
    fields: [
      { name: "expires_at", fieldType: AdminFieldTypeModel.date },
      { name: "user_id", fieldType: AdminFieldTypeModel.objectId },
    ],
  },
  {
    resourceType: AdminResourceTypeModel.users,
    fields: [
      { name: "email", fieldType: AdminFieldTypeModel.string },
      { name: "acceptTerms", fieldType: AdminFieldTypeModel.boolean },
      { name: "isEmailVerified", fieldType: AdminFieldTypeModel.boolean },
      { name: "isAdmin", fieldType: AdminFieldTypeModel.boolean },
      { name: "newPassword", fieldType: AdminFieldTypeModel.boolean },
      {
        name: "authTypes",
        isReadonly: true,
        fieldType: AdminFieldTypeModel.select,
        options: [AuthTypeModel.email],
      },
    ],
  },
];

export function getAdminResourceByType(
  resourceType: AdminResourceTypeModel,
): AdminResourceModel {
  const resource = adminResourcesConfig.find(
    (resource) => resource.resourceType === resourceType,
  );
  if (!resource) {
    throw new InvalidAdminResourceTypeError();
  }
  return resource;
}
