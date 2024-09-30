"use client";
import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";
import { AsyncButton } from "@/src/common/ui/components/button/async-button";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/common/ui/components/shadcn/ui/dialog";
import { toast } from "sonner";

interface ConfirmDialogProps {
  title: string;
  description: string;
  acceptButtonText: string;
  acceptButtonVariant?: "default" | "destructive";

  onClose: () => void;
  onAccept: () => Promise<boolean>;
}

export function ConfirmDialog({
  onClose,
  onAccept,
  title,
  description,
  acceptButtonText,
  acceptButtonVariant,
}: ConfirmDialogProps) {
  async function handleAcceptButtonClick() {
    try {
      const isSuccessful = await onAccept();
      if (isSuccessful) {
        onClose();
      }
    } catch (error) {
      locator_common_ErrorTrackingService().captureError(error);
      toast.error("Ha ocurrido un error");
    }
  }

  return (
    <Dialog open>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle className="mr-4">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Volver
          </Button>
          <AsyncButton
            onClick={handleAcceptButtonClick}
            variant={acceptButtonVariant}
          >
            {acceptButtonText}
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
