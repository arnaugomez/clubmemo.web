"use client";
import { Button, ButtonProps } from "@/src/ui/components/shadcn/ui/button";
import { useState } from "react";
import { CreateCourseDialog } from "./create-course-dialog";

interface CreateCourseButtonProps {
  variant?: ButtonProps["variant"];
}

export function CreateCourseButton({ variant }: CreateCourseButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button variant={variant} onClick={() => setIsOpen(true)}>
        Nuevo curso
      </Button>

      {isOpen && <CreateCourseDialog onClose={() => setIsOpen(false)} />}
    </>
  );
}
