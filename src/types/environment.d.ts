declare namespace NodeJS {
  export interface ProcessEnv {
    /** The MongoDB URL, used to connect to the database */
    readonly MONGODB_URL: string;
    /** The Resend api key, used to send emails */
    readonly RESEND_API_KEY: string;
    /** Whether to send emails or log them to the console */
    readonly SEND_EMAIL: string;
  }
}
