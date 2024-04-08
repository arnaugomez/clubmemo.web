"use client";

import {
  CourseModel,
  CourseModelData,
} from "@/src/core/courses/domain/models/course-model";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/src/ui/components/shadcn/ui/dropdown-menu";
import { Copy, Ellipsis, File, LogOut, Settings2, Trash2 } from "lucide-react";
import { useState } from "react";
import { CopyCourseDialog } from "../../copy/components/copy-course-dialog";
import { DeleteCourseDialog } from "../../delete/components/delete-course-dialog";
import { UnenrollCourseDialog } from "../../enroll/components/unenroll-course-dialog";
import { CourseFavoriteButton } from "./course-favorite-button";
import { ExportCourseAnkiButton } from "./export-course-anki-button";
import { ExportCourseCsvButton } from "./export-course-csv-button";
import { ExportCourseJsonButton } from "./export-course-json-button";

interface CourseDetailActionsDropdownProps {
  courseData: CourseModelData;
}

export function CourseDetailActionsDropdown({
  courseData,
}: CourseDetailActionsDropdownProps) {
  const course = new CourseModel(courseData);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnenrollDialog, setShowUnenrollDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Ellipsis />
            <span className="sr-only">Opciones del curso</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {course.isEnrolled && (
            <>
              <DropdownMenuGroup>
                <CourseFavoriteButton
                  courseId={course.id}
                  isFavorite={course.enrollment?.isFavorite ?? false}
                />
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Settings2 className="mr-2 h-4 w-4" />
              <span>Ajustes</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowCopyDialog(true)}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copiar</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <File className="mr-2 h-4 w-4" />
                <span>Exportar</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <ExportCourseCsvButton course={course} />
                  <ExportCourseJsonButton course={course} />
                  <ExportCourseAnkiButton course={course} />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          {course.canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="text-red-700 focus:text-red-800 focus:bg-red-100 cursor-pointer"
                  onSelect={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Eliminar curso</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
          {!course.isOwner && course.isEnrolled && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="text-red-700 focus:text-red-800 focus:bg-red-100 cursor-pointer"
                  onSelect={() => setShowUnenrollDialog(true)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Desapuntarme</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {showCopyDialog && (
        <CopyCourseDialog
          course={course}
          onClose={() => setShowCopyDialog(false)}
        />
      )}
      {showDeleteDialog && (
        <DeleteCourseDialog
          course={course}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}
      {showUnenrollDialog && (
        <UnenrollCourseDialog
          course={course}
          onClose={() => setShowUnenrollDialog(false)}
        />
      )}
    </>
  );
}
