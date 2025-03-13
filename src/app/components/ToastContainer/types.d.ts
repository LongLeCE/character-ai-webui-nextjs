import { ReactNode } from 'react';

export type ToastContainerImperativeHandle = {
  toast: (toastContent: ReactNode) => void;
};
