import { createContext } from 'react';

export const StreamingResponseManager = createContext<{
  controller: null;
} | null>(null);
