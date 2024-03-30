import { PasswordInput } from "@/src/ui/components/input/password-input";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("PasswordInput", () => {
  render(<PasswordInput />);
  expect(screen.getByRole("button"), "Has a button").toBeDefined();
});
