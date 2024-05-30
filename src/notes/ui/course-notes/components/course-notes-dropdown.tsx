"use client";

import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/common/ui/components/shadcn/ui/dropdown-menu";
import type { CourseModelData } from "@/src/courses/domain/models/course-model";
import { CourseModel } from "@/src/courses/domain/models/course-model";
import { Ellipsis, Sparkle, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCourseNotesContext } from "../contexts/course-notes-context";
import { ImportNotesDialog } from "./import-notes-dialog";

interface CourseNotesDropdownProps {
  courseData: CourseModelData;
}

export function CourseNotesDropdown({ courseData }: CourseNotesDropdownProps) {
  const [, setCourseNotes] = useCourseNotesContext();
  const course = new CourseModel(courseData);

  const [showImportDialog, setShowImportDialog] = useState(false);
  if (!course.canEdit) return <></>;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Ellipsis />
            <span className="sr-only">Otras opciones de añadir tarjeta</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={`/courses/detail/${course.id}/ai-generator`}>
                <Sparkle className="mr-2 h-4 w-4" />
                <span>Generador AI</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowImportDialog(true)}>
              <Upload className="mr-2 h-4 w-4" />
              <span>Importar archivo</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {showImportDialog && (
        <ImportNotesDialog
          courseId={course.id}
          onClose={() => setShowImportDialog(false)}
          onSuccess={(notes) => {
            setCourseNotes((v) => notes.concat(v));
            setShowImportDialog(false);
          }}
        />
      )}
    </>
  );
}
