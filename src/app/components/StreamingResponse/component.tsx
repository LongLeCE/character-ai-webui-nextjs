'use client';

import React, { ReactNode, useContext, useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import BlinkingDots from '../BlinkingDots/component';
import { ChatActions, ChatStreamingResponse } from '../Chat/contexts';

export function markdown2Html(markdown: string, color?: string) {
  return (
    <div
      style={color !== undefined ? { color: color } : undefined}
      className='flex flex-col gap-y-5 [&_li::marker+p]:inline [&_ul]:list-disc [&_ul]:list-outside [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-y-2 [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-y-2 [&_li]:ml-5 [&_em]:text-yellow-500 [&_strong]:text-[#ff0000] [&_em_strong]:text-orange-500 [&_strong_em]:text-orange-500'
    >
      <Markdown remarkPlugins={[remarkGfm]}>{`${markdown}`}</Markdown>
    </div>
  );
}

export default function StreamingResponse(props: {
  endpoint: string;
  payload?: {
    messages: {
      role: string;
      content: ReactNode;
    }[];
    stream?: boolean;
  };
  chunkHandler?: (chunk: string) => string;
  onComplete?: (() => void) | (() => Promise<void>);
}) {
  const [displayMarkdown, setDisplayMarkdown] = useState<ReactNode>(null);

  const chatStreamingResponse = useContext(ChatStreamingResponse);
  const chatActions = useContext(ChatActions);

  useEffect(() => {
    const controller = new AbortController();
    const streamHandler = async () => {
      try {
        const res = await fetch(props.endpoint, {
          signal: controller.signal,
          method: 'post',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: props.payload ? JSON.stringify(props.payload) : undefined
        });
        if (!res.ok || !res.body) {
          throw res.statusText;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        let currResponse = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          let decodedChunk = decoder.decode(value, { stream: true });
          props.chunkHandler && (decodedChunk = props.chunkHandler(decodedChunk));
          currResponse += decodedChunk;
          chatStreamingResponse?.setResponseStream(currResponse);
        }
        props.onComplete && props.onComplete();
      } catch (e) {
        if (!(e instanceof DOMException)) {
          chatActions?.setError('Server not currently reachable');
        }
      }
    };
    chatStreamingResponse?.setController(controller);
    streamHandler();
    return () => controller.abort();
  }, [props.payload, props.endpoint]);

  useEffect(
    () => setDisplayMarkdown(chatStreamingResponse?.responseStream),
    [chatStreamingResponse?.responseStream]
  );

  return chatStreamingResponse?.responseStream ? (
    displayMarkdown
  ) : (
    <span>
      <BlinkingDots className='text-4xl leading-[1rem]' />
    </span>
  );
}
