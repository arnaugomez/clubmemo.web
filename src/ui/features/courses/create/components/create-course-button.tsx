"use client";
import { Button, ButtonProps } from "@/src/ui/components/shadcn/ui/button";
import { useState } from "react";
import { CreateCourseDialog } from "./create-course-dialog";

interface CreateCourseButtonProps {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}

export function CreateCourseButton(props: CreateCourseButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button {...props} onClick={() => setIsOpen(true)}>
        Nuevo curso
      </Button>

      {isOpen && <CreateCourseDialog onClose={() => setIsOpen(false)} />}
    </>
  );
}
