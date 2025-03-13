import { forwardRef, Fragment, ReactNode, useCallback, useImperativeHandle, useState } from 'react';
import crypto from 'crypto';
import Toast from '../Toast/component';
import { ToastContainerActions } from './contexts';
import { ToastContainerImperativeHandle } from './types';
import { ToastConfigs } from '../Toast/types';

const ToastContainer = forwardRef<ToastContainerImperativeHandle, ToastConfigs>((props, ref) => {
  const [toasts, setToasts] = useState<
    {
      id: string;
      node: ReactNode;
    }[]
  >([]);
  const [ids, setIds] = useState(new Set<string>());

  const makeId = useCallback(() => {
    let id = crypto.randomBytes(8).toString('latin1');
    while (ids.has(id)) {
      id = crypto.randomBytes(8).toString('latin1');
    }
    const newIds = new Set(ids);
    newIds.add(id);
    setIds(newIds);
    return id;
  }, [ids]);

  useImperativeHandle(ref, () => {
    return {
      toast(toastContent: ReactNode) {
        const id = makeId();
        setToasts([
          ...toasts,
          {
            id: id,
            node: (
              <Toast id={id} {...props}>
                {toastContent}
              </Toast>
            )
          }
        ]);
      }
    };
  }, [toasts, makeId]);

  const actions = {
    deleteToast: useCallback(
      (id: string) => {
        for (const [i, toast] of toasts.entries()) {
          if (toast.id === id) {
            const newIds = new Set(ids);
            newIds.delete(id);
            setIds(newIds);
            setToasts([...toasts.slice(0, i), ...toasts.slice(i + 1)]);
            return toast.id;
          }
        }
      },
      [toasts, ids]
    )
  };

  return (
    <div className='fixed left-1/2 -translate-x-1/2 flex flex-col items-center gap-y-2'>
      <ToastContainerActions.Provider value={actions}>
        {toasts.map((toast) => (
          <Fragment key={toast.id}>{toast.node}</Fragment>
        ))}
      </ToastContainerActions.Provider>
    </div>
  );
});

ToastContainer.displayName = 'ToastContainer';
export default ToastContainer;
