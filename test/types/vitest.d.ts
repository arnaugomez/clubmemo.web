import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import "vitest";

declare module "vitest" {
  // biome-ignore lint/suspicious/noExplicitAny: type definition
  interface Assertion<T = any> extends TestingLibraryMatchers<T, any> {}
  interface AsymmetricMatchersContaining
    // biome-ignore lint/suspicious/noExplicitAny: type definition
    extends TestingLibraryMatchers<any, any> {}
}
