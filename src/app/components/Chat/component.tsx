'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Conversation from '../Conversation/component';
import ChatInput from '../ChatInput/component';
import ReloadIcon from '@/app/assets/icons/ReloadIcon';
import StreamingResponse, { markdown2Html } from '../StreamingResponse/component';
// import NavBar from '../NavBar/component';
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
import { buildChatMessages } from './utils';
import Character from '@/app/core/character';
import Persona from '@/app/core/persona';

export default function Chat(props?: {
  character?: Character;
  persona?: Persona;
  maxContextTurns?: number;
}) {
  const [character, setCharacter] = useState(props?.character);
  const [persona, setPersona] = useState(props?.persona);
  const [generating, setGenerating] = useState(false);
  const [responseStream, setResponseStream] = useState<string | null>(null);
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
    setController,
    responseStream,
    setResponseStream
  };

  const id2Idx = useCallback(() => {
    const map = new Map<string, number>();
    turns.forEach((turn, i) => {
      map.set(turn.id, i);
    });
    return map;
  }, [turns]);

  const toMessage = useCallback((turn: Message): Message => {
    return {
      role: turn.role,
      content: turn.content
    };
  }, []);

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

  const makeGreetingTurn = useCallback(
    (greeting: string): RenderTurn => {
      return {
        id: makeId(),
        role: 'assistant',
        content: greeting,
        name: character?.name || undefined,
        renderedContent: markdown2Html(greeting),
        fixed: true
      };
    },
    [makeId, character?.name]
  );

  const makeErrorTurn = useCallback(
    (error: string, id?: string): RenderTurn => {
      return {
        id: id ?? makeId(),
        role: 'system',
        content: error,
        name: 'Error',
        renderedContent: markdown2Html(error, 'red')
      };
    },
    [makeId]
  );

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

  const binarySearchIdxMapInner = useCallback(
    <P extends keyof T, T extends { [K in P]: string }>(
      sortedArr: T[],
      key: P,
      itemIdx: number,
      key2IdxMap: Map<string, number>,
      start: number,
      end: number
    ): number => {
      if (end == start) {
        return 0;
      }
      const sliceLength = end - start;
      const middle = start + (sliceLength >> 1);
      const middleIdx = key2IdxMap.get(sortedArr[middle][key]) as number;
      const less = itemIdx < middleIdx;
      if (sliceLength == 1) {
        return less ? start : end;
      }
      if (less) {
        return binarySearchIdxMapInner(sortedArr, key, itemIdx, key2IdxMap, start, middle);
      }
      return binarySearchIdxMapInner(sortedArr, key, itemIdx, key2IdxMap, middle, end);
    },
    []
  );

  const binarySearchIdxMap = useCallback(
    <P extends keyof T, T extends { [K in P]: string }>(
      sortedArr: T[],
      key: P,
      item: T,
      key2IdxMap: Map<string, number>
    ): number => {
      return binarySearchIdxMapInner(
        sortedArr,
        key,
        key2IdxMap.get(item[key]) as number,
        key2IdxMap,
        0,
        sortedArr.length
      );
    },
    []
  );

  const actions = {
    addMemory: useCallback(
      (id: string) => {
        if (!generating && !memoryIds.has(id)) {
          for (let i = turns.length - 1; i >= 0; --i) {
            if (turns[i].id === id) {
              const turn = turns[i];
              const idxMap = id2Idx();
              const insertIdx = binarySearchIdxMap(memories, 'id', turn, idxMap);
              const newMemoryIds = new Set(memoryIds);
              newMemoryIds.add(id);
              setMemoryIds(newMemoryIds);
              setMemories([...memories.slice(0, insertIdx), turn, ...memories.slice(insertIdx)]);
              return id;
            }
          }
        }
      },
      [generating, turns, memories, memoryIds]
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
      if (idx >= 0) {
        return actions.getHistoryUntil(turns[idx].id);
      }
    }, [generating, turns]),
    setHistory: useCallback(
      (messages: Message[]) => {
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
                ? persona?.name || undefined
                : message.role === 'assistant'
                  ? character?.name || undefined
                  : undefined,
            renderedContent: markdown2Html(message.content as string)
          }))
        );
      },
      [generating, turns, persona?.name, character?.name]
    ),
    setError
  };

  const generate = useCallback(
    (messages: RenderTurn[], appendMessages: Message[] = []) => {
      setGenerating(true);
      const appendedMessages = (messages as Message[]).concat(appendMessages);
      setTurns([
        ...messages,
        {
          id: makeId(),
          role: 'assistant',
          content: null,
          name: character?.name || undefined,
          renderedContent: (
            <StreamingResponse
              endpoint={
                process.env.NEXT_PUBLIC_CHAT_ENDPOINT ?? 'http://localhost:8080/v1/chat/completions'
              }
              payload={{
                messages: buildChatMessages(
                  (props?.maxContextTurns
                    ? appendedMessages.slice(
                        Math.max(0, appendedMessages.length - props?.maxContextTurns)
                      )
                    : appendedMessages
                  ).map(toMessage),
                  character,
                  persona,
                  memories
                ),
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
              onComplete={() => setResponseGenerated(true)}
            />
          )
        }
      ]);
    },
    [makeId, character, persona, memories]
  );

  const regenerate = useCallback(() => {
    const currTurns = turns;
    actions.deleteTurn(currTurns[currTurns.length - 1].id);
    generate(currTurns.slice(0, currTurns.length - 1));
  }, [turns, actions.deleteTurn]);

  useEffect(() => {
    if (responseGenerated) {
      setResponseGenerated(false);
      if (responseStream !== null) {
        const generatedTurn = turns[turns.length - 1];
        generatedTurn.content = responseStream;
        generatedTurn.renderedContent = markdown2Html(responseStream, generatedTurn.color);
        setTurns([...turns.slice(0, turns.length - 1), generatedTurn]);
        setResponseStream(null);
      } else {
        setTurns(turns.slice(0, turns.length - 1));
      }
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
            name: persona?.name
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
    if (
      turns.length == 0 ||
      (turns.length > 0 && error !== null && !isError(turns[turns.length - 1]))
    ) {
      setError(null);
    }
  }, [turns]);

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
    const numTurns = turns.length;
    const isFistTurnGreeting = numTurns == 0 || (turns[0].fixed && turns[0].role == 'assistant');
    if (
      numTurns < 2 &&
      isFistTurnGreeting &&
      (numTurns == 0 || character?.greeting != turns[0].content)
    ) {
      if (numTurns == 1) {
        actions.deleteTurn(turns[0].id);
      }
      if (character?.greeting) {
        setTurns([makeGreetingTurn(character.greeting)]);
      }
    }
  }, [character?.greeting, turns]);

  useEffect(() => {
    setTurns(
      turns.map((turn) => {
        return {
          ...turn,
          name:
            turn.role === 'user'
              ? persona?.name || undefined
              : turn.role === 'assistant'
                ? character?.name || undefined
                : undefined
        };
      })
    );
  }, [character?.name, persona?.name]);

  return (
    <div className='flex flex-col justify-between size-screen'>
      {/* <NavBar height='3rem' /> */}
      {/* <div className='flex h-[calc(100%-3rem)]'> */}
      <div className='flex h-full'>
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
                {!generating &&
                turns.length > 0 &&
                !turns[turns.length - 1].fixed &&
                turns[turns.length - 1].role === 'assistant' ? (
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
              <SideBar
                memories={memories}
                character={character}
                persona={persona}
                onUpdateCharacter={setCharacter}
                onUpdatePersona={setPersona}
              />
            </ChatToast.Provider>
          </ChatActions.Provider>
        </div>
      </div>
    </div>
  );
}
