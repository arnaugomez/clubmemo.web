import { describe, expect, test } from "vitest";
import { cn } from "./shadcn";

describe("cn", () => {
  test("does nothing when receives a single class", () => {
    expect(cn("flex-col")).toBe("flex-col");
  });

  test("merges two classes and adds a space in between", () => {
    expect(cn("btn", "btn-primary")).toBe("btn btn-primary");
  });

  test("handles conditional class inputs", () => {
    let isActive = true;
    expect(cn("btn", isActive && "active")).toBe("btn active");
    isActive = false;
    expect(cn("btn", isActive && "active")).toBe("btn");
  });

  test("removes duplicate classes", () => {
    expect(cn("text-red", "text-red")).toBe("text-red");
  });

  test("merges TailwindCSS utility classes correctly", () => {
    expect(cn("text-center", "text-center md:text-left")).toBe(
      "text-center md:text-left",
    );
  });

  test("handles array inputs", () => {
    expect(cn(["btn", "btn-primary"])).toBe("btn btn-primary");
  });

  test("handles object inputs", () => {
    expect(cn({ flex: true, "btn-primary": false, active: true })).toBe(
      "flex active",
    );
  });
});
