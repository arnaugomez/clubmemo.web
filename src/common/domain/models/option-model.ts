/**
 * Represents an option in a select input, a radio group
 * or any other component that requires a label and a value.
 */
export interface OptionModel {
  /**
   * Represents the value in natural language, that a human can understand.
   */
  label: string;
  /**
   * The value used in the application logic. For example, the value is sent to
   * the server and stored in the database, while the label is not.
   */
  value: string;
}
