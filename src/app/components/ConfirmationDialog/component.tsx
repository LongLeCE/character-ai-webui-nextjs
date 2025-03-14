'use client';

import { useCallback } from 'react';
import Overlay from '../Overlay/component';
import { TailwindProps } from '@/app/types';
import ConfirmationOptions from '../ConfirmationOptions/component';

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
        <ConfirmationOptions
          onResult={props.onResult}
          className='flex-row-reverse justify-start w-full'
        />
      </div>
    </Overlay>
  );
}
