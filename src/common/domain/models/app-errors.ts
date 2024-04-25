export class NoPermissionError extends Error {}
export class InvalidFileFormatError extends Error {}
export class NullError extends Error {
  constructor(name: string) {
    super(`${name} is null`);
  }
}
