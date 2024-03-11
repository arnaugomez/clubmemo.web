export function waitMilliseconds(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
