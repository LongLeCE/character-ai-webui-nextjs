'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Conversation from '../Conversation/component';
import ChatInput from '../ChatInput/component';
import ReloadIcon from '@/app/assets/icons/ReloadIcon';
import StreamingResponse, { markdown2Html } from '../StreamingResponse/component';
import NavBar from '../NavBar/component';
import crypto from 'crypto';
import {
  ChatActions,
  ChatMemoryIds,
  ChatState,
  ChatStreamingResponse,
  ChatToast,
  ChatWindow
} from './contexts';
import { RenderTurn } from './types';
import { Message, Turn } from '../TurnRenderer/types';
import ToastContainer from '../ToastContainer/component';
import { ToastContainerImperativeHandle } from '../ToastContainer/types';
import SideBar from '../SideBar/component';
import { range } from '@/app/utils/core';

export default function Chat(props?: {
  user?: string;
  assistant?: string;
  maxContextTurns?: number;
}) {
  const [generating, setGenerating] = useState(false);
  const [responseStream, setResponseStream] = useState('');
  const [responseGenerated, setResponseGenerated] = useState(false);
  const [userInputComplete, setUserInputComplete] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [turns, setTurns] = useState<RenderTurn[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const toastContainerRef = useRef<ToastContainerImperativeHandle>(null);
  const [ids, setIds] = useState(new Set<string>());
  const [memories, setMemories] = useState<RenderTurn[]>([]);
  const [memoryIds, setMemoryIds] = useState(new Set<string>());
  const [controller, setController] = useState<AbortController | null>(null);
  const [error, setError] = useState<string | null>(null);

  const chatState = {
    generating,
    setResponseGenerated,
    hasError: useCallback(() => {
      return error !== null;
    }, [error])
  };

  const chatStreamingResponse = {
    controller,
    setController
  };

  const toMessage = useCallback((turn: Message): Message => {
    return {
      role: turn.role,
      content: turn.content
    };
  }, []);

  const makeErrorTurn = useCallback((error: string, id?: string): RenderTurn => {
    return {
      id: id ?? makeId(),
      role: 'system',
      content: error,
      name: 'Error',
      renderedContent: markdown2Html(error, 'red'),
      createdAt: Date.now()
    };
  }, []);

  const isError = useCallback((turn: Turn): boolean => {
    return turn.role === 'system' && turn.name === 'Error';
  }, []);

  const deleteMemories = useCallback(
    (ids: string[] | Set<string>) => {
      if (!generating) {
        const toDelete = memoryIds.intersection(new Set(ids));
        const newMemoryIds = new Set(memoryIds);
        for (let j = memories.length - 1; j >= 0 && toDelete.size > 0; --j) {
          const id = memories[j].id;
          if (toDelete.has(id)) {
            toDelete.delete(id);
            newMemoryIds.delete(id);
          }
        }
        setMemoryIds(newMemoryIds);
        setMemories(memories.filter((turn) => newMemoryIds.has(turn.id)));
      }
    },
    [generating, memories, memoryIds]
  );

  const actions = {
    addMemory: useCallback(
      (id: string) => {
        if (!generating && !memoryIds.has(id)) {
          for (let i = turns.length - 1; i >= 0; --i) {
            if (turns[i].id === id) {
              const turn = turns[i];
              let insertIdx = 0;
              for (let j = memories.length - 1; j >= 0; --j) {
                if (turn.createdAt >= memories[j].createdAt) {
                  insertIdx = j + 1;
                  break;
                }
              }
              const newMemoryIds = new Set(memoryIds);
              newMemoryIds.add(id);
              setMemoryIds(newMemoryIds);
              setMemories([...memories.slice(0, insertIdx), turn, ...memories.slice(insertIdx)]);
              return id;
            }
          }
        }
      },
      [generating, memories, memoryIds]
    ),
    deleteMemory: useCallback(
      (id: string) => {
        if (!generating && memoryIds.has(id)) {
          for (let j = memories.length - 1; j >= 0; --j) {
            if (id === memories[j].id) {
              const newMemoryIds = new Set(memoryIds);
              newMemoryIds.delete(id);
              setMemoryIds(newMemoryIds);
              setMemories([...memories.slice(0, j), ...memories.slice(j + 1)]);
              return id;
            }
          }
        }
      },
      [generating, memories, memoryIds]
    ),
    deleteTurn: useCallback(
      (id: string) => {
        for (let i = turns.length - 1; i >= 0; --i) {
          if (turns[i].id === id) {
            if (generating && i < turns.length - 1) {
              break;
            }
            actions.deleteMemory(id);
            const newIds = new Set(ids);
            newIds.delete(id);
            setIds(newIds);
            setTurns([...turns.slice(0, i), ...turns.slice(i + 1)]);
            return id;
          }
        }
      },
      [generating, turns, ids, memories, memoryIds]
    ),
    rewind: useCallback(
      (id: string) => {
        for (let i = turns.length - 2; i >= 0; --i) {
          if (turns[i].id === id) {
            const newIds = new Set(ids);
            const toDelete = new Set(turns.slice(i + 1).map((turn) => turn.id));
            newIds.difference(toDelete);
            deleteMemories(toDelete);
            setIds(newIds);
            setTurns(turns.slice(0, i + 1));
            return id;
          }
        }
      },
      [turns, ids, memories, memoryIds]
    ),
    getContent: useCallback(
      (id: string) => {
        for (let i = turns.length - 1; i >= 0; --i) {
          if (turns[i].id === id) {
            return turns[i].content;
          }
        }
      },
      [turns]
    ),
    getHistoryUntil: useCallback(
      (id: string) => {
        for (let i = turns.length - 1; i >= 0; --i) {
          if (turns[i].id === id) {
            return turns.slice(0, i + 1).map(toMessage);
          }
        }
      },
      [turns]
    ),
    getHistory: useCallback(() => {
      const idx = generating ? turns.length - 2 : turns.length - 1;
      if (idx > 0) {
        return actions.getHistoryUntil(turns[idx].id);
      }
    }, [turns]),
    setHistory: useCallback((messages: Message[]) => {
      const now = Date.now();
      if (generating) {
        controller?.abort();
        setTurns([...turns.slice(0, turns.length - 1)]);
      }
      setMemories([]);
      setMemoryIds(new Set());
      setIds(new Set(range(messages.length).map((id) => id.toString())));
      setTurns(
        messages.map((message, i) => ({
          id: i.toString(),
          role: message.role,
          content: message.content,
          name:
            message.role === 'user'
              ? props?.user
              : message.role === 'assistant'
                ? props?.assistant
                : undefined,
          renderedContent: markdown2Html(message.content as string),
          createdAt: now
        }))
      );
    }, []),
    setError
  };

  const makeId = useCallback(() => {
    let id = crypto.randomBytes(16).toString('latin1');
    while (ids.has(id)) {
      id = crypto.randomBytes(16).toString('latin1');
    }
    const newIds = new Set(ids);
    newIds.add(id);
    setIds(newIds);
    return id;
  }, [ids]);

  const generate = useCallback(
    (messages: RenderTurn[], appendMessages: Message[] = []) => {
      setGenerating(true);
      const appendedMessages = (messages as (RenderTurn | Message)[]).concat(appendMessages);
      setTurns([
        ...messages,
        {
          id: makeId(),
          role: 'assistant',
          content: null,
          name: props?.assistant,
          renderedContent: (
            <StreamingResponse
              endpoint={
                process.env.NEXT_PUBLIC_CHAT_ENDPOINT ?? 'http://localhost:8080/v1/chat/completions'
              }
              payload={{
                messages: (props?.maxContextTurns
                  ? appendedMessages.slice(
                      Math.max(0, appendedMessages.length - props?.maxContextTurns)
                    )
                  : appendedMessages
                ).map(toMessage),
                stream: true
              }}
              chunkHandler={(chunk) =>
                chunk
                  .split('\n')
                  .map((line) => {
                    const start = line.indexOf('{');
                    return start == -1
                      ? ''
                      : (JSON.parse(line.slice(start).trimEnd()).choices[0].delta.content ?? '');
                  })
                  .join('')
              }
              onUpdate={setResponseStream}
              onComplete={() => setResponseGenerated(true)}
            />
          ),
          createdAt: -1
        }
      ]);
    },
    [makeId]
  );

  const regenerate = useCallback(() => {
    const currTurns = turns;
    actions.deleteTurn(currTurns[currTurns.length - 1].id);
    generate(currTurns.slice(0, currTurns.length - 1));
  }, [turns, actions.deleteTurn]);

  useEffect(() => {
    if (responseGenerated) {
      setResponseGenerated(false);
      const generatedTurn = turns[turns.length - 1];
      generatedTurn.content = responseStream;
      generatedTurn.renderedContent = markdown2Html(responseStream, generatedTurn.color);
      generatedTurn.createdAt = Date.now();
      setTurns([...turns.slice(0, turns.length - 1), generatedTurn]);
    }
  }, [responseGenerated]);

  useEffect(() => {
    if (userInputComplete) {
      setUserInputComplete(false);
      if (userInput) {
        generate([
          ...turns,
          {
            id: makeId(),
            role: 'user',
            content: userInput,
            renderedContent: markdown2Html(userInput),
            name: props?.user,
            createdAt: Date.now()
          }
        ]);
        setUserInput('');
      } else {
        generate(turns);
      }
    }
  }, [userInputComplete]);

  useEffect(() => {
    if (chatContainerRef.current) {
      const scrollToBottomDist =
        chatContainerRef.current.scrollHeight -
        chatContainerRef.current.getBoundingClientRect().height;
      if (chatContainerRef.current.scrollTop < scrollToBottomDist) {
        chatContainerRef.current.scrollTop = scrollToBottomDist;
      }
    }
  }, [responseStream, generating]);

  useEffect(() => {
    if (
      generating &&
      (turns.length == 0 || (turns.length > 0 && turns[turns.length - 1].content !== null))
    ) {
      setGenerating(false);
    }
  }, [turns, memories]);

  useEffect(() => {
    if (error !== null) {
      const errorTurn = makeErrorTurn(error);
      if (generating) {
        const currTurns = turns;
        actions.deleteTurn(currTurns[currTurns.length - 1].id);
        setTurns([...currTurns.slice(0, turns.length - 1), errorTurn]);
      } else {
        setTurns([...turns, errorTurn]);
      }
    }
  }, [error]);

  useEffect(() => {
    if (turns.length > 0 && error !== null && !isError(turns[turns.length - 1])) {
      setError(null);
    }
  }, [turns]);

  return (
    <div className='flex flex-col justify-between size-screen'>
      <NavBar height='3rem' />
      <div className='flex h-[calc(100%-3rem)]'>
        <div className='w-[25%]'></div>
        <ChatState.Provider value={chatState}>
          <ChatStreamingResponse.Provider value={chatStreamingResponse}>
            <div className='flex flex-col w-[50%]'>
              <div ref={chatContainerRef} className='flex-grow overflow-y-scroll p-4'>
                <ToastContainer ref={toastContainerRef} closeOnClick={true} />
                <ChatWindow.Provider value={chatContainerRef}>
                  <ChatActions.Provider value={actions}>
                    <ChatToast.Provider value={toastContainerRef}>
                      <ChatMemoryIds.Provider value={memoryIds}>
                        <Conversation turns={turns} />
                      </ChatMemoryIds.Provider>
                    </ChatToast.Provider>
                  </ChatActions.Provider>
                </ChatWindow.Provider>
                {!generating && turns.length > 0 && turns[turns.length - 1].role !== 'user' ? (
                  <button
                    onClick={() => {
                      regenerate();
                      setError(null);
                    }}
                    className='size-5 ml-2.5 mr-auto aspect-square rounded-[50%]'
                  >
                    <ReloadIcon className='fill-white' />
                  </button>
                ) : (
                  <></>
                )}
              </div>
              <div className='w-full'>
                <ChatInput
                  onInputComplete={() => setUserInputComplete(true)}
                  onInputChange={setUserInput}
                />
              </div>
            </div>
          </ChatStreamingResponse.Provider>
        </ChatState.Provider>
        <div className='w-[25%] flex items-center justify-center'>
          <ChatActions.Provider value={actions}>
            <ChatToast.Provider value={toastContainerRef}>
              <SideBar memories={memories} />
            </ChatToast.Provider>
          </ChatActions.Provider>
        </div>
      </div>
    </div>
  );
}
