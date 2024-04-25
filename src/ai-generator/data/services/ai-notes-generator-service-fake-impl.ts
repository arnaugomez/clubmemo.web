import {
  AiNotesGeneratorService,
  GenerateAiNotesInputModel,
} from "../../domain/interfaces/ai-notes-generator-service";

export class AiNotesGeneratorServiceFakeImpl
  implements AiNotesGeneratorService
{
  async generate({}: GenerateAiNotesInputModel): Promise<string[][]> {
    return [
      [
        "¿Cómo se define una ecuación de segundo grado?",
        "Es una ecuación algebraica cuyo mayor exponente de la incógnita es 2.",
      ],
      [
        "¿Cuál es la forma general de una ecuación de segundo grado?",
        "ax^2 + bx + c = 0",
      ],
      [
        "¿Qué son las raíces de una ecuación de segundo grado?",
        "Son los valores de x que satisfacen la ecuación y hacen que sea igual a cero.",
      ],
      [
        "¿Qué es el discriminante en una ecuación de segundo grado?",
        "Es la expresión b^2 - 4ac que se encuentra dentro de la fórmula cuadrática.",
      ],
      [
        "¿Cuántas soluciones puede tener una ecuación de segundo grado?",
        "Puede tener 0, 1 o 2 soluciones.",
      ],
      [
        "¿Cuál es la fórmula general para hallar las soluciones de una ecuación de segundo grado?",
        "x = (-b ± √(b^2 - 4ac)) / 2a",
      ],
      [
        "¿Cómo se llama el proceso de encontrar las raíces de una ecuación de segundo grado?",
        "Se llama resolver la ecuación.",
      ],
      [
        "¿Qué tipo de gráfica representa una ecuación de segundo grado?",
        "Representa una parábola.",
      ],
      [
        "¿Qué relación existe entre los coeficientes a, b y c de una ecuación de segundo grado y las soluciones?",
        "Los coeficientes determinan la naturaleza y cantidad de soluciones, según el discriminante.",
      ],
      [
        "¿Qué ocurre si el discriminante es positivo en una ecuación de segundo grado?",
        "La ecuación tiene dos soluciones reales y distintas.",
      ],
    ];
  }
}
