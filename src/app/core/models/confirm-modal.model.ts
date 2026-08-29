export type ConfirmModalType = 'danger' | 'warning' | 'info' | 'primary';

export interface ConfirmModalData {
  title?: string;
  message: string;
  type?: ConfirmModalType;
  confirmText?: string;
  cancelText?: string;
  requireTextConfirmation?: boolean;
  confirmationKeyword?: string;
}
