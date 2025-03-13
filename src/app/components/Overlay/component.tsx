import { TailwindProps } from '@/app/types';
import { ReactNode } from 'react';

export default function Overlay(
  props?: TailwindProps & {
    children?: ReactNode;
    onClick?:
      | ((e: React.MouseEvent<HTMLDivElement>) => void)
      | ((e: React.MouseEvent<HTMLDivElement>) => Promise<void>);
  }
) {
  return (
    <div onClick={props?.onClick} className={`size-full center-screen ${props?.className ?? ''}`}>
      {props?.children}
    </div>
  );
}
