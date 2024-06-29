import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CourseNotesLoadingSkeletons } from "./course-notes-loading-skeletons";

describe("CourseNotesLoadingSkeletons", () => {
  it("renders three skeletons", () => {
    render(<CourseNotesLoadingSkeletons />);
    const skeletons = screen.getAllByTestId(
      "CourseNotesLoadingSkeletons__skeleton",
    );
    expect(skeletons).toHaveLength(3);
  });
});
