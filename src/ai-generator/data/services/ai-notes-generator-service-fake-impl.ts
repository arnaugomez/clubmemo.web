import type { NoteRowModel } from "@/src/notes/domain/models/note-row-model";
import type {
  AiNotesGeneratorService,
  GenerateAiNotesInputModel,
} from "../../domain/interfaces/ai-notes-generator-service";

/**
 * Fake implementation of the AI notes generator service.
 * Used for testing and local development, to avoid making too many
 * requests to the external AI service. This lets us speed up the
 * development process and avoid being charged a fee for each request.
 */
export class AiNotesGeneratorServiceFakeImpl
  implements AiNotesGeneratorService
{
  async generate({}: GenerateAiNotesInputModel): Promise<NoteRowModel[]> {
    return [
      {
        front: "¿Cómo se define una ecuación de segundo grado?",
        back: "Es una ecuación algebraica cuyo mayor exponente de la incógnita es 2.",
      },
      {
        front: "¿Cuál es la forma general de una ecuación de segundo grado?",
        back: "ax^2 + bx + c = 0",
      },
      {
        front: "¿Qué son las raíces de una ecuación de segundo grado?",
        back: "Son los valores de x que satisfacen la ecuación y hacen que sea igual a cero.",
      },
      {
        front: "¿Qué es el discriminante en una ecuación de segundo grado?",
        back: "Es la expresión b^2 - 4ac que se encuentra dentro de la fórmula cuadrática.",
      },
      {
        front: "¿Cuántas soluciones puede tener una ecuación de segundo grado?",
        back: "Puede tener 0, 1 o 2 soluciones.",
      },
      {
        front:
          "¿Cuál es la fórmula general para hallar las soluciones de una ecuación de segundo grado?",
        back: "x = (-b ± √(b^2 - 4ac)) / 2a",
      },
      {
        front:
          "¿Cómo se llama el proceso de encontrar las raíces de una ecuación de segundo grado?",
        back: "Se llama resolver la ecuación.",
      },
      {
        front: "¿Qué tipo de gráfica representa una ecuación de segundo grado?",
        back: "Representa una parábola.",
      },
      {
        front:
          "¿Qué relación existe entre los coeficientes a, b y c de una ecuación de segundo grado y las soluciones?",
        back: "Los coeficientes determinan la naturaleza y cantidad de soluciones, según el discriminante.",
      },
      {
        front:
          "¿Qué ocurre si el discriminante es positivo en una ecuación de segundo grado?",
        back: "La ecuación tiene dos soluciones reales y distintas.",
      },
    ];
  }
}
