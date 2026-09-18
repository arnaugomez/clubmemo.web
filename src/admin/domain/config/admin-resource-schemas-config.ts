import * as Schema from "effect/Schema";
import * as SchemaGetter from "effect/SchemaGetter";
import { default_maximum_interval } from "ts-fsrs";

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
import { AdminResourceTypeModel } from "../models/admin-resource-model";

/**
 * Validation schemas for the create and update forms of the admin panel. Each
 * admin resource has different fields and therefore has different validation
 * schema. The validation schemas are built with the Effect Schema validation library.
 */
const adminResourceSchemas: Record<
  AdminResourceTypeModel,
  Schema.ConstraintDecoder<Record<string, unknown>>
> = {
  [AdminResourceTypeModel.courseEnrollments]: Schema.Struct({
    courseId: ObjectIdSchema,
    profileId: ObjectIdSchema,
    isFavorite: Schema.Boolean,
    config: Schema.optional(
      Schema.Struct({
        enableFuzz: Schema.optional(Schema.Boolean),
        maximumInterval: Schema.optional(
          Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n)))
            .check(
              Schema.isInt({
                message: "Se esperaba entero, se recibió decimal",
              }),
            )
            .check(
              Schema.isGreaterThanOrEqualTo(1, {
                message: `El número debe ser mayor o igual a ${1}`,
              }),
            )
            .check(
              Schema.isLessThanOrEqualTo(default_maximum_interval, {
                message: `El número debe ser menor o igual a ${default_maximum_interval}`,
              }),
            ),
        ),
        requestRetention: Schema.optional(
          Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n)))
            .check(
              Schema.isGreaterThanOrEqualTo(0, {
                message: `El número debe ser mayor o igual a ${0}`,
              }),
            )
            .check(
              Schema.isLessThanOrEqualTo(1, {
                message: `El número debe ser menor o igual a ${1}`,
              }),
            ),
        ),
        dailyNewCardsCount: Schema.optional(
          Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n)))
            .check(
              Schema.isInt({
                message: "Se esperaba entero, se recibió decimal",
              }),
            )
            .check(
              Schema.isGreaterThanOrEqualTo(1, {
                message: `El número debe ser mayor o igual a ${1}`,
              }),
            )
            .check(
              Schema.isLessThanOrEqualTo(100, {
                message: `El número debe ser menor o igual a ${100}`,
              }),
            ),
        ),
        showAdvancedRatingOptions: Schema.optional(Schema.Boolean),
      }),
    ),
  }),
  [AdminResourceTypeModel.coursePermissions]: Schema.Struct({
    courseId: ObjectIdSchema,
    profileId: ObjectIdSchema,
    permissionType: Schema.Literals([
      CoursePermissionTypeModel.edit,
      CoursePermissionTypeModel.view,
      CoursePermissionTypeModel.own,
    ]),
  }),
  [AdminResourceTypeModel.courses]: Schema.Struct({
    name: Schema.String.pipe(
      Schema.decode({
        decode: SchemaGetter.transform((value) => value.trim()),
        encode: SchemaGetter.passthrough(),
      }),
    )
      .check(
        Schema.isMinLength(1, {
          message: `El texto debe contener al menos ${1} carácter(es)`,
        }),
      )
      .check(
        Schema.isMaxLength(50, {
          message: `El texto debe contener como máximo ${50} carácter(es)`,
        }),
      ),
    description: Schema.String.pipe(
      Schema.decode({
        decode: SchemaGetter.transform((value) => value.trim()),
        encode: SchemaGetter.passthrough(),
      }),
    )
      .check(
        Schema.isMinLength(0, {
          message: `El texto debe contener al menos ${0} carácter(es)`,
        }),
      )
      .check(
        Schema.isMaxLength(255, {
          message: `El texto debe contener como máximo ${255} carácter(es)`,
        }),
      ),
    picture: OptionalFileFieldSchema,
    isPublic: Schema.Boolean,
    tags: TagsSchema,
  }),
  [AdminResourceTypeModel.emailVerificationCodes]: Schema.Struct({
    userId: ObjectIdSchema,
    code: Schema.String.check(
      Schema.isLengthBetween(6, 6, {
        message: `El texto debe contener exactamente ${6} carácter(es)`,
      }),
    ),
    expiresAt: Schema.Date,
  }),
  [AdminResourceTypeModel.fileUploads]: Schema.Struct({
    collection: Schema.Literals(["profiles", "courses"]),
    field: Schema.String.check(
      Schema.isMinLength(1, {
        message: `El texto debe contener al menos ${1} carácter(es)`,
      }),
    ),
    url: Schema.String.check(
      Schema.makeFilter(
        (value) => {
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        },
        { message: "Enlace inválido" },
      ),
    ),
    key: Schema.String.check(
      Schema.isMinLength(1, {
        message: `El texto debe contener al menos ${1} carácter(es)`,
      }),
    ),
    contentType: Schema.String,
    createdByUserId: ObjectIdSchema,
    createdAt: Schema.Date,
  }),
  [AdminResourceTypeModel.forgotPasswordTokens]: Schema.Struct({
    userId: ObjectIdSchema,
    expiresAt: Schema.Date,
  }),
  [AdminResourceTypeModel.notes]: Schema.Struct({
    courseId: ObjectIdSchema,
    front: Schema.String,
    back: Schema.String,
    createdAt: Schema.Date,
  }),
  [AdminResourceTypeModel.practiceCards]: Schema.Struct({
    courseEnrollmentId: ObjectIdSchema,
    noteId: ObjectIdSchema,
    due: Schema.Date,
    stability: Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n))),
    difficulty: Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n))),
    elapsedDays: Schema.Number.check(
      Schema.makeFilter((n) => !Number.isNaN(n)),
    ).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
    scheduledDays: Schema.Number.check(
      Schema.makeFilter((n) => !Number.isNaN(n)),
    ).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
    reps: Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n))).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
    lapses: Schema.Number.check(
      Schema.makeFilter((n) => !Number.isNaN(n)),
    ).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
    state: PracticeCardStateModelSchema,
    lastReview: Schema.optional(
      Schema.NullOr(Schema.optional(Schema.Date)),
    ).pipe(
      Schema.decodeTo(Schema.optional(Schema.Date), {
        decode: SchemaGetter.transform((x) => x ?? undefined),
        encode: SchemaGetter.passthrough(),
      }),
    ),
  }),
  [AdminResourceTypeModel.profiles]: Schema.Struct({
    userId: ObjectIdSchema,
    displayName: Schema.optional(Schema.String),
    handle: Schema.Union([
      Schema.optional(HandleSchema),
      Schema.Literal("").pipe(
        Schema.decodeTo(Schema.Undefined, {
          decode: SchemaGetter.transform(() => undefined),
          encode: SchemaGetter.transform(() => "" as const),
        }),
      ),
    ]),
    bio: Schema.optional(Schema.String),
    website: Schema.Union([
      Schema.optional(
        Schema.String.check(
          Schema.makeFilter(
            (value) => {
              try {
                new URL(value);
                return true;
              } catch {
                return false;
              }
            },
            { message: "Enlace inválido" },
          ),
        ).check(
          Schema.isMaxLength(2083, {
            message: `El texto debe contener como máximo ${2083} carácter(es)`,
          }),
        ),
      ),
      Schema.String.check(
        Schema.isMaxLength(0, {
          message: `El texto debe contener como máximo ${0} carácter(es)`,
        }),
      ),
    ]),
    isPublic: Schema.Boolean,
    tags: TagsSchema,
    picture: OptionalFileFieldSchema,
    backgroundPicture: OptionalFileFieldSchema,
  }),
  [AdminResourceTypeModel.rateLimits]: Schema.Struct({
    name: Schema.String,
    count: Schema.Number.check(
      Schema.makeFilter((n) => !Number.isNaN(n)),
    ).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
    updatedAt: Schema.Date,
  }),
  [AdminResourceTypeModel.reviewLogs]: Schema.Struct({
    cardId: ObjectIdSchema,
    courseEnrollmentId: ObjectIdSchema,
    rating: PracticeCardRatingModelSchema,
    state: PracticeCardStateModelSchema,
    due: Schema.Date,
    stability: Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n))),
    difficulty: Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n))),
    elapsedDays: Schema.Number.check(
      Schema.makeFilter((n) => !Number.isNaN(n)),
    ).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
    lastElapsedDays: Schema.Number.check(
      Schema.makeFilter((n) => !Number.isNaN(n)),
    ).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
    scheduledDays: Schema.Number.check(
      Schema.makeFilter((n) => !Number.isNaN(n)),
    ).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
    review: Schema.Date,
  }),
  [AdminResourceTypeModel.sessions]: Schema.Struct({
    expires_at: Schema.Date,
    user_id: ObjectIdSchema,
  }),
  [AdminResourceTypeModel.tags]: Schema.Struct({ name: TagNameSchema }),
  [AdminResourceTypeModel.users]: Schema.Struct({
    email: Schema.String.check(
      Schema.isPattern(
        /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i,
        { message: "Correo inválido" },
      ),
    ),
    authTypes: Schema.mutable(
      Schema.Array(Schema.Literals([AuthTypeModel.email])),
    ).check(
      Schema.isMinLength(1, {
        message: `La lista debe contener al menos ${1} elemento(s)`,
      }),
    ),
    acceptTerms: AcceptTermsSchema,
    isEmailVerified: Schema.optional(Schema.Boolean),
    isAdmin: Schema.optional(Schema.Boolean),
    newPassword: Schema.Union([
      PasswordSchema,
      Schema.optional(Schema.Literal("")),
    ]),
  }),
};

/**
 * Special validation schemas that are applied on the create form. If not
 * available, the schema from `adminResourceSchemas` shall be used.
 */
const adminResourceCreateSchemas: Partial<
  Record<
    AdminResourceTypeModel,
    Schema.ConstraintDecoder<Record<string, unknown>>
  >
> = {
  [AdminResourceTypeModel.users]: Schema.Struct({
    email: Schema.String.check(
      Schema.isPattern(
        /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i,
        { message: "Correo inválido" },
      ),
    ),
    authTypes: Schema.mutable(
      Schema.Array(Schema.Literals([AuthTypeModel.email])),
    ).check(
      Schema.isMinLength(1, {
        message: `La lista debe contener al menos ${1} elemento(s)`,
      }),
    ),
    acceptTerms: AcceptTermsSchema,
    isEmailVerified: Schema.optional(Schema.Boolean),
    isAdmin: Schema.optional(Schema.Boolean),
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
 * Gets a Effect Schema validation schema for a form of a certain admin resource
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
