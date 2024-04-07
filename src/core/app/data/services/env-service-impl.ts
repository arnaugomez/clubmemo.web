import { EnvService } from "../../domain/interfaces/env-service";

export class EnvServiceImpl implements EnvService {
  readonly mongodbUrl = process.env.MONGODB_URL;
  readonly resendApiKey = process.env.RESEND_API_KEY;
  readonly sendEmail = process.env.SEND_EMAIL === "true";
  readonly baseUrl = process.env.BASE_URL;
  readonly passwordPepper = process.env.PASSWORD_PEPPER;
  readonly openaiApiKey = process.env.OPENAI_API_KEY;
  readonly fakeOpenAiApi = process.env.FAKE_OPENAI_API === "true";
}
