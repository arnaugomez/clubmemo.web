export function testSetting(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing test setting: ${name}`);
  return value;
}
