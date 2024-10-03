import { AuthTypeModel } from "@/src/auth/domain/models/auth-type-model";
import { CoursePermissionTypeModel } from "@/src/courses/domain/models/course-permission-type-model";
import { PracticeCardRatingModel } from "@/src/practice/domain/models/practice-card-rating-model";
import { PracticeCardStateModel } from "@/src/practice/domain/models/practice-card-state-model";
import { default_maximum_interval } from "ts-fsrs";
import { InvalidAdminResourceTypeError } from "../models/admin-errors";
import type { AdminResourceModel } from "../models/admin-resource-model";
import {
  AdminFieldDisplayModel,
  AdminFieldTypeModel,
  AdminResourceTypeModel,
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
      {
        name: "cardId",
        fieldType: AdminFieldTypeModel.objectId,
        resourceType: AdminResourceTypeModel.practiceCards,
      },
      {
        name: "courseEnrollmentId",
        fieldType: AdminFieldTypeModel.objectId,
        resourceType: AdminResourceTypeModel.courseEnrollments,
      },
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
      {
        name: "userId",
        fieldType: AdminFieldTypeModel.objectId,
        resourceType: AdminResourceTypeModel.users,
      },
      { name: "displayName", fieldType: AdminFieldTypeModel.string },
      { name: "handle", fieldType: AdminFieldTypeModel.string },
      {
        name: "bio",
        fieldType: AdminFieldTypeModel.string,
        display: AdminFieldDisplayModel.textarea,
      },
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
      {
        name: "courseEnrollmentId",
        fieldType: AdminFieldTypeModel.objectId,
        resourceType: AdminResourceTypeModel.courseEnrollments,
      },
      {
        name: "noteId",
        fieldType: AdminFieldTypeModel.objectId,
        resourceType: AdminResourceTypeModel.notes,
      },
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
      {
        name: "courseId",
        fieldType: AdminFieldTypeModel.objectId,
        resourceType: AdminResourceTypeModel.courses,
      },
      { name: "front", fieldType: AdminFieldTypeModel.richText },
      { name: "back", fieldType: AdminFieldTypeModel.richText },
      { name: "createdAt", fieldType: AdminFieldTypeModel.date },
    ],
  },
  {
    cannotCreate: true,
    resourceType: AdminResourceTypeModel.forgotPasswordTokens,
    fields: [
      {
        name: "userId",
        fieldType: AdminFieldTypeModel.objectId,
        resourceType: AdminResourceTypeModel.users,
      },
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
      {
        name: "userId",
        fieldType: AdminFieldTypeModel.objectId,
        resourceType: AdminResourceTypeModel.users,
      },
      { name: "code", fieldType: AdminFieldTypeModel.string },
      { name: "expiresAt", fieldType: AdminFieldTypeModel.date },
    ],
  },
  {
    resourceType: AdminResourceTypeModel.fileUploads,
    fields: [
      {
        name: "collection",
        fieldType: AdminFieldTypeModel.select,
        options: ["profiles", "courses"],
      },
      { name: "field", fieldType: AdminFieldTypeModel.string },
      { name: "contentType", fieldType: AdminFieldTypeModel.string },
      {
        name: "createdByUserId",
        fieldType: AdminFieldTypeModel.objectId,
        resourceType: AdminResourceTypeModel.users,
      },
      { name: "createdAt", fieldType: AdminFieldTypeModel.date },
    ],
  },
  {
    resourceType: AdminResourceTypeModel.courseEnrollments,
    fields: [
      {
        name: "courseId",
        fieldType: AdminFieldTypeModel.objectId,
        resourceType: AdminResourceTypeModel.courses,
      },
      {
        name: "profileId",
        fieldType: AdminFieldTypeModel.objectId,
        resourceType: AdminResourceTypeModel.profiles,
      },
      { name: "isFavorite", fieldType: AdminFieldTypeModel.boolean },
      {
        name: "config",
        fieldType: AdminFieldTypeModel.form,
        fields: [
          {
            name: "maximumInterval",
            fieldType: AdminFieldTypeModel.number,
            display: AdminFieldDisplayModel.slider,
            extraProps: {
              max: default_maximum_interval,
            },
          },
          {
            name: "requestRetention",
            fieldType: AdminFieldTypeModel.number,
            display: AdminFieldDisplayModel.slider,
            extraProps: {
              step: 0.01,
              max: 1,
            },
          },
          {
            name: "dailyNewCardsCount",
            fieldType: AdminFieldTypeModel.number,
            display: AdminFieldDisplayModel.slider,
            extraProps: {
              max: 100,
            },
          },
          { name: "enableFuzz", fieldType: AdminFieldTypeModel.boolean },
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
      {
        name: "courseId",
        fieldType: AdminFieldTypeModel.objectId,
        resourceType: AdminResourceTypeModel.courses,
      },
      {
        name: "profileId",
        fieldType: AdminFieldTypeModel.objectId,
        resourceType: AdminResourceTypeModel.profiles,
      },
      {
        name: "permissionType",
        fieldType: AdminFieldTypeModel.select,
        options: [
          CoursePermissionTypeModel.view,
          CoursePermissionTypeModel.edit,
          CoursePermissionTypeModel.own,
        ],
      },
    ],
  },
  {
    resourceType: AdminResourceTypeModel.courses,
    fields: [
      { name: "name", fieldType: AdminFieldTypeModel.string },
      {
        name: "description",
        fieldType: AdminFieldTypeModel.string,
        display: AdminFieldDisplayModel.textarea,
      },
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
      {
        name: "user_id",
        fieldType: AdminFieldTypeModel.objectId,
        resourceType: AdminResourceTypeModel.users,
      },
    ],
  },
  {
    showCreationWarning: true,
    resourceType: AdminResourceTypeModel.users,
    fields: [
      {
        name: "email",
        fieldType: AdminFieldTypeModel.string,
        extraProps: { type: "email" },
      },
      { name: "acceptTerms", fieldType: AdminFieldTypeModel.boolean },
      { name: "isEmailVerified", fieldType: AdminFieldTypeModel.boolean },
      { name: "isAdmin", fieldType: AdminFieldTypeModel.boolean },
      {
        name: "newPassword",
        fieldType: AdminFieldTypeModel.string,
        display: AdminFieldDisplayModel.password,
      },
      {
        name: "authTypes",
        fieldType: AdminFieldTypeModel.selectMultiple,
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
