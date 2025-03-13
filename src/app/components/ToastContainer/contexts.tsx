import { createContext } from 'react';

export const ToastContainerActions = createContext<{
  deleteToast: (id: string) => string | undefined;
} | null>(null);
