import { toNestErrors } from "@hookform/resolvers";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import * as SchemaIssue from "effect/SchemaIssue";
import type { FieldError, FieldValues, Resolver } from "react-hook-form";

const spanishTypes: Record<string, string> = {
  String: "texto",
  Number: "número",
  Boolean: "booleano",
  Objects: "objeto",
  Arrays: "lista",
  Declaration: "fecha",
  Undefined: "indefinido",
  Null: "nulo",
  string: "texto",
  number: "número",
  boolean: "booleano",
  object: "objeto",
};

/** Shared presentation of schema failures in forms and server-action responses. */
const format = SchemaIssue.makeFormatterStandardSchemaV1({
  leafHook(issue) {
    if (issue._tag === "MissingKey") return "Requerido";
    if (issue._tag === "InvalidType") {
      if (issue.input === undefined || issue.input === null) return "Requerido";
      const expected = spanishTypes[issue.ast._tag] ?? "valor válido";
      const received = Array.isArray(issue.input)
        ? "lista"
        : (spanishTypes[typeof issue.input] ?? typeof issue.input);
      return `Se esperaba ${expected}, se recibió ${received}`;
    }
    return SchemaIssue.defaultLeafHook(issue);
  },
});

export function schemaFieldErrors(
  error: Schema.SchemaError,
): Record<string, FieldError> {
  const fields: Record<string, FieldError> = {};
  for (const issue of format(error.issue).issues) {
    const path =
      issue.path
        ?.map((part) =>
          typeof part === "object" ? String(part.key) : String(part),
        )
        .join(".") ?? "";
    fields[path] ??= { type: "validation", message: issue.message };
  }
  return fields;
}

export function schemaResolver<T extends FieldValues>(
  schema: Schema.ConstraintDecoder<T>,
): Resolver<T> {
  return (values, _context, options) => {
    const result = Schema.decodeUnknownResult(schema, { errors: "all" })(
      values,
    );
    if (Result.isSuccess(result)) return { values: result.success, errors: {} };
    return {
      values: {},
      errors: toNestErrors(schemaFieldErrors(result.failure), options),
    };
  };
}
