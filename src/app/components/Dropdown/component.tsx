'use client';

import { Fragment, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Overlay from '../Overlay/component';
import { ChatState, ChatWindow } from '../Chat/contexts';
import { DropdownActions } from './contexts';

export default function Dropdown(props: {
  children: ReactNode;
  dropdownLabel: ReactNode;
  dropdownPosition?: 'left' | 'right' | 'center';
}) {
  const [renderDropdownContent, setRenderDropdownContent] = useState(false);
  const [dropdownContentInvisible, setDropdownContentInvisible] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState<'up' | 'down'>('down');
  const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right' | 'center'>(
    props.dropdownPosition ?? 'right'
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);
  const chatWindow = useContext(ChatWindow);
  const chatState = useContext(ChatState);

  const actions = {
    setRenderDropdownContent
  };

  const toggleDropdownContentVisibility = useCallback(() => {
    setDropdownContentInvisible(true);
    setRenderDropdownContent(!renderDropdownContent);
  }, [renderDropdownContent]);

  useEffect(() => {
    if (
      renderDropdownContent &&
      dropdownRef.current &&
      dropdownButtonRef.current &&
      dropdownContentRef.current &&
      chatWindow?.current
    ) {
      if (
        dropdownDirection === 'down' &&
        dropdownContentRef.current.getBoundingClientRect().bottom >
          chatWindow?.current.getBoundingClientRect().bottom
      ) {
        setDropdownDirection('up');
      } else if (dropdownDirection === 'up') {
        const dropdownButtonRect = dropdownButtonRef.current.getBoundingClientRect();
        const dropdownContentRect = dropdownContentRef.current.getBoundingClientRect();
        if (
          dropdownContentRect.bottom +
            dropdownContentRect.height +
            dropdownButtonRect.height +
            ((dropdownRef.current.getBoundingClientRect().height - dropdownButtonRect.height) <<
              1) <=
          chatWindow?.current.getBoundingClientRect().bottom
        ) {
          setDropdownDirection('down');
        }
      }
      if (
        dropdownPosition !== 'left' &&
        dropdownContentRef.current.getBoundingClientRect().right >
          chatWindow?.current.getBoundingClientRect().right
      ) {
        setDropdownPosition('left');
      } else if (
        dropdownPosition !== 'right' &&
        dropdownContentRef.current.getBoundingClientRect().left <
          chatWindow?.current.getBoundingClientRect().left
      ) {
        setDropdownPosition('right');
      }
    }
    setDropdownContentInvisible(false);
  }, [renderDropdownContent, chatState]);

  return (
    <div
      ref={dropdownRef}
      className={`flex ${dropdownDirection === 'down' ? 'flex-col' : 'flex-col-reverse -top-2'} gap-y-2 ${dropdownPosition === 'left' ? 'items-end' : dropdownPosition === 'center' ? 'items-center' : 'items-start'}`}
    >
      <button ref={dropdownButtonRef} onClick={toggleDropdownContentVisibility}>
        {props.dropdownLabel}
      </button>
      <div className='relative'>
        {renderDropdownContent && props.children ? (
          <>
            <Overlay className='z-10' onClick={() => setRenderDropdownContent(false)} />
            <div
              ref={dropdownContentRef}
              className={`absolute flex flex-col items-center justify-evenly rounded-2xl overflow-hidden z-20 ${dropdownContentInvisible ? 'invisible' : ''} ${dropdownDirection === 'up' ? '-translate-y-full' : ''} ${dropdownPosition === 'left' ? '-translate-x-full' : dropdownPosition === 'center' ? '-translate-x-1/2' : ''}`}
            >
              <DropdownActions.Provider value={actions}>
                {Array.isArray(props.children)
                  ? props.children.map((child, idx) => <Fragment key={idx}>{child}</Fragment>)
                  : props.children}
              </DropdownActions.Provider>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
