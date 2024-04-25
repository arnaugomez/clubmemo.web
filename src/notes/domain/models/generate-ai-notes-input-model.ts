import { GenerateAiNotesInputModel } from "@/src/ai-generator/domain/interfaces/ai-notes-generator-service";

export interface GenerateAiNotesUseCaseInputModel
  extends GenerateAiNotesInputModel {
  profileId: string;
  courseId: string;
}
