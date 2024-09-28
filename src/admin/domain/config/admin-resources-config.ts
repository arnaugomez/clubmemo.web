import type { OptionModel } from "@/src/common/domain/models/option-model";
import { PracticeCardRatingModel } from "@/src/practice/domain/models/practice-card-rating-model";
import { PracticeCardStateModel } from "@/src/practice/domain/models/practice-card-state-model";
import {
  AdminFieldTypeModel,
  AdminResourceTypeModel,
  type AdminResourceModel,
} from "../models/admin-resource-model";

const practiceCardStateOptions: OptionModel[] = [
  { value: PracticeCardStateModel.learning, label: "Aprendiendo" },
  { value: PracticeCardStateModel.new, label: "Nueva" },
  { value: PracticeCardStateModel.relearning, label: "Reaprendiendo" },
  { value: PracticeCardStateModel.review, label: "Repasar" },
];

const practiceCardRatingOptions: OptionModel[] = [
  { value: PracticeCardRatingModel.again, label: "Repetir" },
  { value: PracticeCardRatingModel.easy, label: "Fácil" },
  { value: PracticeCardRatingModel.good, label: "Bien" },
  { value: PracticeCardRatingModel.hard, label: "Difícil" },
  { value: PracticeCardRatingModel.manual, label: "Manual" },
];

export const adminResourcesConfig: AdminResourceModel[] = [
  {
    type: AdminResourceTypeModel.tags,
    fields: [{ name: "name", type: AdminFieldTypeModel.string }],
  },
  {
    type: AdminResourceTypeModel.reviewLogs,
    fields: [
      { name: "cardId", type: AdminFieldTypeModel.objectId },
      { name: "courseEnrollmentId", type: AdminFieldTypeModel.objectId },
      {
        name: "rating",
        type: AdminFieldTypeModel.select,
        options: practiceCardRatingOptions,
      },
      {
        name: "state",
        type: AdminFieldTypeModel.select,
        options: practiceCardStateOptions,
      },
      { name: "due", type: AdminFieldTypeModel.date },
      { name: "stability", type: AdminFieldTypeModel.number },
      { name: "difficulty", type: AdminFieldTypeModel.number },
      { name: "elapsedDays", type: AdminFieldTypeModel.number },
      { name: "lastElapsedDays", type: AdminFieldTypeModel.number },
      { name: "scheduledDays", type: AdminFieldTypeModel.number },
      { name: "review", type: AdminFieldTypeModel.date },
    ],
  },
  {
    type: AdminResourceTypeModel.rateLimits,
    fields: [
      { name: "name", type: AdminFieldTypeModel.string },
      { name: "count", type: AdminFieldTypeModel.number },
      { name: "updatedAt", type: AdminFieldTypeModel.date },
    ],
  },
  {
    type: AdminResourceTypeModel.profiles,
    fields: [
      { name: "userId", type: AdminFieldTypeModel.objectId },
      { name: "displayName", type: AdminFieldTypeModel.string },
      { name: "handle", type: AdminFieldTypeModel.string },
      { name: "bio", type: AdminFieldTypeModel.string },
      { name: "picture", type: AdminFieldTypeModel.string },
      { name: "backgroundPicture", type: AdminFieldTypeModel.string },
      { name: "website", type: AdminFieldTypeModel.string },
      { name: "isPublic", type: AdminFieldTypeModel.boolean },
      { name: "tags", type: AdminFieldTypeModel.tags },
    ],
  },
  {
    type: AdminResourceTypeModel.practiceCards,
    fields: [
      { name: "courseEnrollmentId", type: AdminFieldTypeModel.objectId },
      { name: "noteId", type: AdminFieldTypeModel.objectId },
      { name: "due", type: AdminFieldTypeModel.date },
      { name: "stability", type: AdminFieldTypeModel.number },
      { name: "difficulty", type: AdminFieldTypeModel.number },
      { name: "elapsedDays", type: AdminFieldTypeModel.number },
      { name: "scheduledDays", type: AdminFieldTypeModel.number },
      { name: "reps", type: AdminFieldTypeModel.number },
      { name: "lapses", type: AdminFieldTypeModel.number },
      {
        name: "state",
        type: AdminFieldTypeModel.select,
        options: practiceCardStateOptions,
      },
      { name: "lastReview", type: AdminFieldTypeModel.date },
    ],
  },

  {
    type: AdminResourceTypeModel.notes,
    fields: [
      { name: "courseId", type: AdminFieldTypeModel.objectId },
      { name: "front", type: AdminFieldTypeModel.string },
      { name: "back", type: AdminFieldTypeModel.string },
      { name: "createdAt", type: AdminFieldTypeModel.date },
    ],
  },
  {
    type: AdminResourceTypeModel.forgotPasswordTokens,
    fields: [
      { name: "userId", type: AdminFieldTypeModel.objectId },
      { name: "tokenHash", isReadonly: true, type: AdminFieldTypeModel.string },
      { name: "expiresAt", type: AdminFieldTypeModel.date },
    ],
  },
  {
    type: AdminResourceTypeModel.emailVerificationCodes,
    fields: [
      { name: "userId", type: AdminFieldTypeModel.objectId },
      { name: "code", type: AdminFieldTypeModel.string },
      { name: "expiresAt", type: AdminFieldTypeModel.date },
    ],
  },
  {
    type: AdminResourceTypeModel.courseEnrollments,
    fields: [
      { name: "courseId", type: AdminFieldTypeModel.objectId },
      { name: "profileId", type: AdminFieldTypeModel.objectId },
      { name: "isFavorite", type: AdminFieldTypeModel.boolean },
      {
        name: "config",
        type: AdminFieldTypeModel.form,
        fields: [
          { name: "enableFuzz", type: AdminFieldTypeModel.boolean },
          { name: "maximumInterval", type: AdminFieldTypeModel.number },
          { name: "requestRetention", type: AdminFieldTypeModel.number },
          { name: "dailyNewCardsCount", type: AdminFieldTypeModel.number },
          {
            name: "showAdvancedRatingOptions",
            type: AdminFieldTypeModel.boolean,
          },
        ],
      },
    ],
  },
  {
    type: AdminResourceTypeModel.coursePermissions,
    fields: [
      { name: "courseId", type: AdminFieldTypeModel.objectId },
      { name: "profileId", type: AdminFieldTypeModel.objectId },
      { name: "permissionType", type: AdminFieldTypeModel.string },
    ],
  },
  {
    type: AdminResourceTypeModel.courses,
    fields: [
      { name: "name", type: AdminFieldTypeModel.string },
      { name: "description", type: AdminFieldTypeModel.string },
      { name: "picture", type: AdminFieldTypeModel.string },
      { name: "isPublic", type: AdminFieldTypeModel.boolean },
      { name: "tags", type: AdminFieldTypeModel.tags },
    ],
  },
  {
    type: AdminResourceTypeModel.sessions,
    fields: [
      { name: "expires_at", type: AdminFieldTypeModel.date },
      { name: "user_id", type: AdminFieldTypeModel.objectId },
    ],
  },
  {
    type: AdminResourceTypeModel.users,
    fields: [
      { name: "email", type: AdminFieldTypeModel.string },
      { name: "acceptTerms", type: AdminFieldTypeModel.boolean },
      { name: "isEmailVerified", type: AdminFieldTypeModel.boolean },
      { name: "isAdmin", type: AdminFieldTypeModel.boolean },
    ],
  },
];
