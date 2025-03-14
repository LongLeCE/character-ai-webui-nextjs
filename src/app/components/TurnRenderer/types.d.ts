import { ReactNode } from 'react';

export type Message = {
  role: string;
  content: ReactNode;
};

export type Turn = Message & {
  id: string;
  name?: string;
  fixed?: boolean;
};

export type TurnRendererProps = Turn & {
  isFirst?: boolean;
  isLast?: boolean;
  isInMemory?: boolean;
  hideOptions?: boolean;
  cursorPointer?: boolean;
  onClick?:
    | ((e: React.MouseEvent<HTMLDivElement>) => void)
    | ((e: React.MouseEvent<HTMLDivElement>) => Promise<void>);
};
