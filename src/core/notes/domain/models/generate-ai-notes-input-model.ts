import { GenerateAiNotesInputModel } from "@/src/core/ai-generator/domain/interfaces/ai-notes-generator-service";

export interface GenerateAiNotesUseCaseInputModel
  extends GenerateAiNotesInputModel {
  profileId: string;
  courseId: string;
}
