import { mockConsoleError } from "@/test/utils/mock-console";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReactContextNotFoundError } from "../models/context-errors";
import { createContextHook, createNullContext } from "./context"; // Adjust the import path as necessary

describe("createContextHook", () => {
  it("throws CourseDoesNotExistError when context value is null", () => {
    const TestContext = createNullContext<string>();
    const useTestContext = createContextHook(TestContext);
    const TestComponent = () => {
      const value = useTestContext();
      return <div>{value}</div>;
    };

    const mock = mockConsoleError();
    expect(() => render(<TestComponent />)).toThrow(ReactContextNotFoundError);
    mock.mockRestore();
  });

  it("returns the context value when it is not null", () => {
    const TestContext = createNullContext<string>();
    const useTestContext = createContextHook(TestContext);
    const TestComponent = () => {
      const value = useTestContext();
      return <div>{value}</div>;
    };

    render(
      <TestContext.Provider value="Test Value">
        <TestComponent />
      </TestContext.Provider>,
    );

    expect(screen.getByText("Test Value")).toBeInTheDocument();
  });
});
