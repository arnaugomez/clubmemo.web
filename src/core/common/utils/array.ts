export function shuffle<T>(array: T[]) {
  return array.sort(() => Math.random() - 0.5);
}
