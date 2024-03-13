export interface EnvService {
  /** The MongoDB URL, used to connect to the database */
  readonly mongodbUrl: string;
  /** Whether to send real emails or log them to the console */
  readonly sendEmail: boolean;
  /** The Resend api key, used to send emails */
  readonly resendApiKey: string;
  /** The base url of the website, for example, https://example.com */
  readonly baseUrl: string;
}
