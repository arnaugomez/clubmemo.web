import type { LucideProps } from "lucide-react";
import {
  BanIcon,
  BookIcon,
  BookUserIcon,
  CalendarClockIcon,
  IdCardIcon,
  KeyRoundIcon,
  LogsIcon,
  MailCheckIcon,
  MailQuestionIcon,
  NotebookPenIcon,
  TagIcon,
  TicketIcon,
  UploadIcon,
  UserIcon,
} from "lucide-react";
import type { ForwardRefExoticComponent } from "react";
import { AdminResourceTypeModel } from "../../domain/models/admin-resource-model";

const map: Record<
  AdminResourceTypeModel,
  ForwardRefExoticComponent<Omit<LucideProps, "ref">>
> = {
  [AdminResourceTypeModel.tags]: TagIcon,
  [AdminResourceTypeModel.reviewLogs]: LogsIcon,
  [AdminResourceTypeModel.rateLimits]: BanIcon,
  [AdminResourceTypeModel.courseEnrollments]: TicketIcon,
  [AdminResourceTypeModel.coursePermissions]: BookUserIcon,
  [AdminResourceTypeModel.courses]: BookIcon,
  [AdminResourceTypeModel.emailVerificationCodes]: MailCheckIcon,
  [AdminResourceTypeModel.fileUploads]: UploadIcon,
  [AdminResourceTypeModel.forgotPasswordTokens]: MailQuestionIcon,
  [AdminResourceTypeModel.notes]: NotebookPenIcon,
  [AdminResourceTypeModel.practiceCards]: CalendarClockIcon,
  [AdminResourceTypeModel.profiles]: UserIcon,
  [AdminResourceTypeModel.sessions]: KeyRoundIcon,
  [AdminResourceTypeModel.users]: IdCardIcon,
};

interface AdminResourceIconProps extends Omit<LucideProps, "ref"> {
  adminResourceType: AdminResourceTypeModel;
}

export const AdminResourceIcon = ({
  adminResourceType,
  ...props
}: AdminResourceIconProps) => {
  const Icon = map[adminResourceType];
  return <Icon {...props} />;
};
