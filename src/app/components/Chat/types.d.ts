import { ReactNode } from 'react';
import { Turn } from '../TurnRenderer/types';

export type RenderTurn = Turn & {
  renderedContent: ReactNode;
  createdAt: number;
  color?: string;
};
