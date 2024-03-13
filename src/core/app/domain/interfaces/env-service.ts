export interface EnvService {
  /** The MongoDB URL, used to connect to the database */
  readonly mongodbUrl: string;
  /** Whether to send emails or log them to the console */
  readonly sendEmail: boolean;
  /** The Resend api key, used to send emails */
  readonly resendApiKey: string;
}
