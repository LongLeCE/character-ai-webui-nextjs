import { createContext } from 'react';
import { Turn } from './types';

export const TurnContext = createContext<
  | (Turn & {
      isFirst?: boolean;
      isLast?: boolean;
      isInMemory?: boolean;
    })
  | null
>(null);
