import React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { dialogMessages } from '@/constants/message.constant';

interface AlertDialogComponentProps {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AlertDialogComponent: React.FC<AlertDialogComponentProps> = ({
  trigger,
  title = dialogMessages.areYouSure,
  description = dialogMessages.cannotBeUndone,
  onConfirm,
  confirmText = 'Continue',
  cancelText = 'Cancel',
  open,
  onOpenChange,
}) => (
  <AlertDialog
    open={open}
    onOpenChange={onOpenChange}>
    {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel data-testid='cancel-delete'>
          {cancelText}
        </AlertDialogCancel>

        <AlertDialogAction
          data-testid='confirm-delete'
          onClick={() => {
            onConfirm();
            onOpenChange?.(false);
          }}>
          {confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
export default AlertDialogComponent;
