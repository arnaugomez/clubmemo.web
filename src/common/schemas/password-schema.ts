import * as Schema from "effect/Schema";

export const PasswordSchema = Schema.String.check(
  Schema.isMinLength(8, {
    message: `El texto debe contener al menos ${8} carácter(es)`,
  }),
)
  .check(
    Schema.isMaxLength(256, {
      message: `El texto debe contener como máximo ${256} carácter(es)`,
    }),
  )
  .check(
    Schema.makeFilter((value) => /[a-zA-Z]/.test(value), {
      message: "Debe contener al menos una letra del alfabeto",
    }),
  )
  .check(
    Schema.makeFilter((value) => /[0-9]/.test(value), {
      message: "Debe contener al menos un número",
    }),
  )
  .check(
    Schema.makeFilter(
      (value) => /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/.test(value),
      { message: "Debe contener al menos un carácter especial" },
    ),
  );
