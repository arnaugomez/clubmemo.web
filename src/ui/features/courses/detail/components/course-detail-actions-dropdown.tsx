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
import {
  Copy,
  Ellipsis,
  File,
  FileCode,
  FileSpreadsheet,
  LogOut,
  Settings2,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { DeleteCourseDialog } from "../../delete/components/delete-course-dialog";
import { UnenrollCourseDialog } from "../../enroll/components/unenroll-course-dialog";

interface CourseDetailActionsDropdownProps {
  courseData: CourseModelData;
}

export function CourseDetailActionsDropdown({
  courseData,
}: CourseDetailActionsDropdownProps) {
  const course = new CourseModel(courseData);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnenrollDialog, setShowUnenrollDialog] = useState(false);
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
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Settings2 className="mr-2 h-4 w-4" />
              <span>Ajustes</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              <span>Duplicar</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <File className="mr-2 h-4 w-4" />
                <span>Exportar</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>CSV</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileCode className="mr-2 h-4 w-4" />
                    <span>JSON</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Star className="mr-2 h-4 w-4" />
                    <span>Anki</span>
                  </DropdownMenuItem>
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
