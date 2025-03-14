import { ReactNode } from 'react';
import { Turn } from '../TurnRenderer/types';

export type RenderTurn = Turn & {
  renderedContent: ReactNode;
  color?: string;
};
