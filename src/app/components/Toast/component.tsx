'use client';

import { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ToastContainerActions } from '../ToastContainer/contexts';
import { ToastConfigs } from './types';

export default function Toast(
  props: ToastConfigs & {
    children: ReactNode;
    id: string;
  }
) {
  const ttl = useMemo(() => props.ttl ?? 3000, []);
  const [kill, setKill] = useState(false);
  const [killExpires, setKillExpires] = useState<number | null>(null);

  const toastContainerActions = useContext(ToastContainerActions);

  const deleteAction = useCallback(() => {
    toastContainerActions?.deleteToast(props.id);
  }, [props.id, toastContainerActions?.deleteToast]);

  useEffect(() => {
    if (!kill && ttl > 0) {
      const timer = setTimeout(() => setKill(true), ttl);
      return () => clearTimeout(timer);
    }
  }, [kill]);

  useEffect(() => {
    if (kill) {
      let ttl;
      if (killExpires === null) {
        ttl = 100;
        setKillExpires(Date.now() + ttl);
      } else {
        ttl = killExpires - Date.now();
      }
      if (ttl > 0) {
        const timer = setTimeout(deleteAction, ttl);
        return () => clearTimeout(timer);
      } else {
        deleteAction();
      }
    }
  }, [kill, killExpires, deleteAction]);

  return (
    <div
      onClick={props.closeOnClick ? () => setKill(true) : undefined}
      className={`flex items-center justify-center py-3 px-[1.125rem] rounded-3xl bg-white text-black ${kill ? 'animate-slide-out-to' : 'animate-slide-in-to'} [animation-duration:_100ms] ${props.closeOnClick ? 'cursor-pointer' : ''}`}
    >
      {props.children}
    </div>
  );
}
