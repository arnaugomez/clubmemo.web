import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { describe, expect, it } from "vitest";
import { schemaFieldErrors } from "@/src/common/effect/schema-resolver";
import { EmailSchema } from "@/src/common/schemas/email-schema";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { PasswordSchema } from "@/src/common/schemas/password-schema";
import { EnrolledCourseListItemModel } from "@/src/courses/domain/models/enrolled-course-list-item-model";
import { CreateCourseActionSchema } from "@/src/courses/ui/create/schemas/create-course-action-schema";

const Form = Schema.Struct({ email: EmailSchema, password: PasswordSchema });
describe("Effect form schema compatibility", () => {
  it("keeps Spanish field messages and aggregates errors", () => {
    const result = Schema.decodeUnknownResult(Form, { errors: "all" })({
      email: "invalid",
      password: "short",
    });
    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result))
      expect(schemaFieldErrors(result.failure)).toMatchObject({
        email: { message: "Correo inválido" },
        password: { message: "El texto debe contener al menos 8 carácter(es)" },
      });
  });
  it("keeps missing fields and nested paths", () => {
    const result = Schema.decodeUnknownResult(
      Schema.Struct({ account: Form }),
      { errors: "all" },
    )({ account: {} });
    if (Result.isFailure(result))
      expect(schemaFieldErrors(result.failure)).toMatchObject({
        "account.email": { message: "Requerido" },
        "account.password": { message: "Requerido" },
      });
    else throw new Error("Expected validation failure");
  });
  it("preserves trimming and strips unrecognized form input", () => {
    expect(
      Schema.decodeUnknownSync(CreateCourseActionSchema)({
        name: "  My course  ",
        injected: true,
      }),
    ).toEqual({ name: "My course" });
  });
  it("accepts only complete hexadecimal object identifiers", () => {
    for (const id of ["", "a".repeat(23), "g".repeat(24)])
      expect(
        Result.isFailure(Schema.decodeUnknownResult(ObjectIdSchema)(id)),
      ).toBe(true);
    expect(
      Schema.decodeUnknownSync(ObjectIdSchema)("ABCDEF0123456789abcdef01"),
    ).toBe("ABCDEF0123456789abcdef01");
  });
  it("accepts new courses without an uploaded picture", () => {
    const course = new EnrolledCourseListItemModel({
      courseId: "course",
      name: "Course",
      newCount: 1,
      dueCount: 0,
      isFavorite: false,
    });
    expect(course.picture).toBeUndefined();
    expect(course.shouldPractice).toBe(true);
    expect(
      new EnrolledCourseListItemModel({ ...course.data, picture: null })
        .picture,
    ).toBeUndefined();
  });
});
