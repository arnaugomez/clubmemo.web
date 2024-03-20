import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PasswordInput } from "@/src/ui/components/input/password-input";

test("PasswordInput", () => {
  render(<PasswordInput />);
  expect(screen.getByRole("button"), "Has a button").toBeDefined();
});
