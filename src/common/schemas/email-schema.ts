import * as Schema from "effect/Schema";

export const EmailSchema = Schema.String.check(
  Schema.isPattern(
    /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i,
    { message: "Correo inválido" },
  ),
).check(
  Schema.isMaxLength(254, {
    message: `El texto debe contener como máximo ${254} carácter(es)`,
  }),
);
