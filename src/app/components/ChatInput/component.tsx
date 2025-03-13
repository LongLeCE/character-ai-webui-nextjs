'use client';

import SendIcon from '@/app/assets/icons/SendIcon';
import SquareIcon from '@/app/assets/icons/SquareIcon';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ChatState, ChatStreamingResponse } from '../Chat/contexts';

export default function ChatInput(props: {
  onInputComplete: (() => Promise<void>) | (() => void);
  onInputChange?: ((content: string) => Promise<void>) | ((content: string) => void);
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState('');

  const chatState = useContext(ChatState);
  const chatStreamingResponse = useContext(ChatStreamingResponse);

  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    props.onInputChange && props.onInputChange(e.target.value);
  }, []);

  const updateInputHeight = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.style.height = '0px';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputRef.current]);

  const onClick = useCallback(async () => {
    if (chatState?.generating) {
      chatStreamingResponse?.controller?.abort();
      chatState?.setResponseGenerated(true);
    } else if (inputRef.current) {
      setContent('');
      props.onInputComplete();
    }
  }, [inputRef.current, props.onInputComplete, chatStreamingResponse?.controller]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef.current]);

  useEffect(updateInputHeight, [content, updateInputHeight]);

  useEffect(() => {
    window.addEventListener('resize', updateInputHeight);
    return () => window.removeEventListener('resize', updateInputHeight);
  }, [updateInputHeight]);

  return (
    <div className='flex items-end w-full border border-[#303136] border-solid bg-[#202024] rounded-3xl'>
      <div className='flex items-center w-full min-h-12'>
        <textarea
          ref={inputRef}
          className='w-full max-h-60 outline-none bg-transparent resize-none no-scrollbar py-3 pr-3 pl-[1.125rem]'
          value={content}
          onChange={onChange}
          placeholder={props.placeholder ?? 'Message...'}
          rows={1}
        />
      </div>
      <button
        disabled={chatState?.hasError()}
        onClick={onClick}
        className='h-10 bg-[#fafafa] my-1 mr-1 aspect-square rounded-[50%] disabled:opacity-50 hover:opacity-90 active:opacity-90'
      >
        {chatState?.generating ? (
          <SquareIcon className='w-2/5 m-auto fill-[#26272b]' />
        ) : (
          <SendIcon className='w-1/2 m-auto fill-[#26272b]' />
        )}
      </button>
    </div>
  );
}
