'use client';

import { useCallback } from 'react';
import Overlay from '../Overlay/component';
import { TailwindProps } from '@/app/types';

export default function ConfirmationDialog(
  props: {
    message: string;
    onResult: ((result: boolean) => Promise<void>) | ((result: boolean) => void);
  } & TailwindProps
) {
  const onClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  return (
    <Overlay
      onClick={onClick}
      className={`bg-black opacity-90 flex items-center justify-center ${props.className ?? ''}`}
    >
      <div className='flex flex-col items-center justify-center gap-y-2'>
        <p>{props.message}</p>
        <div className='flex items-center justify-end gap-x-2 w-full'>
          <div onClick={() => props.onResult(false)} className='hover:cursor-pointer'>
            cancel
          </div>
          <div
            onClick={() => props.onResult(true)}
            className='hover:cursor-pointer bg-white text-black px-2 py-1 rounded-2xl'
          >
            Confirm
          </div>
        </div>
      </div>
    </Overlay>
  );
}
