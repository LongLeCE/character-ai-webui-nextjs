'use client';

import { useCallback, useContext, useState } from 'react';
import TurnRenderer from '../TurnRenderer/component';
import { TurnRendererProps } from '../TurnRenderer/types';
import ConfirmationDialog from '../ConfirmationDialog/component';
import { ChatActions, ChatToast } from '../Chat/contexts';

export default function MemoryRenderer(props: TurnRendererProps) {
  const [showOverlay, setShowOverlay] = useState(false);

  const toggleDeleteConfirmation = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setShowOverlay(!showOverlay);
    },
    [showOverlay]
  );

  const chatActions = useContext(ChatActions);
  const chatToast = useContext(ChatToast);

  const onConfirmationResult = useCallback(
    (result: boolean) => {
      if (result) {
        const deletedMemory = chatActions?.deleteMemory(props.id);
        if (deletedMemory !== undefined) {
          chatToast?.current?.toast('Memory deleted!');
        }
      } else {
        setShowOverlay(false);
      }
    },
    [chatActions?.deleteMemory, chatToast?.current?.toast]
  );

  return (
    <>
      {showOverlay ? (
        <ConfirmationDialog message='Delete this memory?' onResult={onConfirmationResult} />
      ) : (
        <></>
      )}
      <TurnRenderer {...props} onClick={toggleDeleteConfirmation} />
    </>
  );
}
