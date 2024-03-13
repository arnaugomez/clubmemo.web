declare namespace NodeJS {
  export interface ProcessEnv {
    /** The MongoDB URL, used to connect to the database */
    readonly MONGODB_URL: string;
    /** Whether to send real emails or log them to the console */
    readonly SEND_EMAIL: string;
    /** The Resend api key, used to send emails */
    readonly RESEND_API_KEY: string;
    /** The base url of the website */
    readonly BASE_URL: string;
  }
}
