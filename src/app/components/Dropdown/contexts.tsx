import { createContext } from 'react';

export const DropdownActions = createContext<{
  setRenderDropdownContent: (state: boolean) => void;
} | null>(null);
