"use client";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { CreateCourseDialog } from "./create-course-dialog";
import { useState } from "react";

export function CreateCourseButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        Nuevo curso
      </Button>

      {isOpen && <CreateCourseDialog onClose={() => setIsOpen(false)} />}
    </>
  );
}
